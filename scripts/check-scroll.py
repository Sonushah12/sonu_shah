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
    ('#home', '.hero-copy', 'transform'),
    ('#home', '.title-scribble', 'strokeDashoffset'),
    ('#work .section-heading', '#work .section-heading', 'transform'),
    ('.archive-heading', '.archive-heading', 'transform'),
    ('.archive-item', '.archive-item', 'transform'),
    ('.about-heading', '.about-heading', 'transform'),
    ('.about-copy', '.about-copy', 'transform'),
    ('.capabilities article', '.capabilities article', 'transform'),
    ('.timeline-item', '.timeline-item', 'transform'),
    ('.timeline', '.timeline-trace > span', 'transform'),
    ('.contact-copy', '.contact-copy', 'transform'),
    ('.contact-decoration', '.contact-decoration', 'transform'),
]

with sync_playwright() as playwright:
    browser = playwright.chromium.launch(
        executable_path=shutil.which('chromium') or shutil.which('chromium-browser'),
        args=['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
    )
    page = browser.new_page(viewport={'width': 1440, 'height': 1000}, reduced_motion='no-preference')
    page.goto(args.url, wait_until='networkidle')
    page.evaluate('document.fonts.ready')
    page.wait_for_timeout(1800)
    assert page.evaluate('portfolioMotion.mode') == 'native-scroll-timelines'
    for subject, target, property_name in scenes:
        top = page.locator(subject).first.evaluate('(e)=>e.getBoundingClientRect().top+scrollY')
        maximum = page.evaluate('document.documentElement.scrollHeight-innerHeight')
        positions = [0, 220, 440] if subject == '#home' else [max(0, top-950), max(0, top-600), min(maximum, top-200)]
        states = []
        for position in positions + [positions[1], positions[0]]:
            page.evaluate('(y)=>new Promise(resolve=>{scrollTo({top:y,behavior:"instant"});requestAnimationFrame(()=>requestAnimationFrame(resolve))})', position)
            states.append(page.locator(target).first.evaluate('(e,p)=>getComputedStyle(e)[p]', property_name))
        assert states[0] != states[2], f'{subject}: forward scroll did not change the effect'
        assert states[1] == states[3], f'{subject}: reverse scroll did not restore the midpoint'
        assert states[0] == states[4], f'{subject}: reverse scroll did not restore the entry'
        print(f'PASS {subject}: forward and backward states match')
    # The project notebook now changes pages over native scroll steps instead of
    # moving individual images while the notebook stays sticky.
    geometry = page.evaluate('''()=>{const t=document.querySelector('.project-scroll-track');return {top:t.getBoundingClientRect().top+scrollY,sticky:parseFloat(t.style.getPropertyValue('--project-sticky-top')),step:parseFloat(t.querySelectorAll('.project-scroll-step')[1].style.top)}}''')
    for index in list(range(5)) + list(reversed(range(5))):
        position = geometry['top'] + index * geometry['step'] - geometry['sticky'] + 8
        page.evaluate('(y)=>scrollTo({top:y,behavior:"instant"})', position)
        page.wait_for_function('(n)=>document.querySelector(".project-pager").dataset.page===String(n) && !document.querySelector(".project-pager").hasAttribute("data-transitioning")', arg=index + 1)
        assert page.locator('.project-card:visible').count() == 1
        print(f'PASS project {index + 1}: scroll selects the correct page')
    page.locator('#motion-toggle').click()
    assert page.evaluate('portfolioMotion.animations') == 0, 'Pause left active scroll animations'
    assert page.locator('.image-plane').first.evaluate('(e)=>getComputedStyle(e).transform') == 'none'
    browser.close()
print(f'{len(scenes)} reversible scenes, 5 project pages in both directions, and motion pause passed.')
