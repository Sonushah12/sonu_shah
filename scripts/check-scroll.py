"""Check scroll reversibility against a running production build.

Requires Python Playwright and Chromium. Run with --url to select the server.
"""
import argparse
import shutil
from playwright.sync_api import sync_playwright

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--url', default='http://127.0.0.1:8011/')
args = parser.parse_args()

# Each tuple identifies a chapter and one visible effect representing it.
scenes = [
    ('#home', '.hero-title-line', 'transform'),
    ('.kinetic-band', '.band-track', 'transform'),
    ('#work', '#work .section-title > span', 'transform'),
    *[(f'.case-step:nth-child({i})', f'.case-step:nth-child({i}) .shutter', 'transform') for i in range(1, 6)],
    ('#archive', '.compact-title', 'transform'),
    ('#about', '.reading-word:last-child > span', 'opacity'),
    ('.system-diagram', '.ring-one', 'transform'),
    ('#journey', '#journey .section-title > span', 'transform'),
    ('.timeline', '.timeline-spine > span', 'transform'),
    ('#contact', '#contact h2 > span', 'transform'),
]

with sync_playwright() as playwright:
    browser = playwright.chromium.launch(
        executable_path=shutil.which('chromium') or shutil.which('chromium-browser'),
        args=['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
    )
    page = browser.new_page(viewport={'width': 1440, 'height': 1000}, reduced_motion='no-preference')
    page.goto(args.url, wait_until='networkidle')
    assert page.evaluate('portfolioMotion.mode') == 'native-scroll-timelines'
    for subject, target, property_name in scenes:
        top = page.locator(subject).first.evaluate('(e)=>e.getBoundingClientRect().top+scrollY')
        maximum = page.evaluate('document.documentElement.scrollHeight-innerHeight')
        positions = [0, 220, 440] if subject == '#home' else [max(0, top-950), max(0, top-600), min(maximum, top-200)]
        states = []
        for position in positions + [positions[1], positions[0]]:
            page.evaluate('(y)=>scrollTo({top:y,behavior:"instant"})', position)
            page.wait_for_timeout(100)
            states.append(page.locator(target).first.evaluate('(e,p)=>getComputedStyle(e)[p]', property_name))
        assert states[0] != states[2], f'{subject}: forward scroll did not change the effect'
        assert states[1] == states[3], f'{subject}: reverse scroll did not restore the midpoint'
        assert states[0] == states[4], f'{subject}: reverse scroll did not restore the entry'
        print(f'PASS {subject}: forward and backward states match')
    page.locator('#motion-toggle').click()
    assert page.evaluate('portfolioMotion.animations') == 0, 'Pause left active scroll animations'
    assert page.locator('.shutter').first.evaluate('(e)=>getComputedStyle(e).display') == 'none'
    browser.close()
print(f'{len(scenes)} reversible scenes and motion pause passed.')
