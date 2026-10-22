"""Exercise the paginated project showcase against a running production build."""
import argparse
import shutil
from playwright.sync_api import sync_playwright

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--url', default='http://127.0.0.1:8000/')
args = parser.parse_args()
count = 0


def check(name, result):
    global count
    assert result, name
    count += 1
    print(f'PASS {name}', flush=True)


def settled(page):
    page.wait_for_function('!document.querySelector(".project-pager").hasAttribute("data-transitioning")')
    page.evaluate('new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))')


def select(page, index):
    page.locator('.project-page-buttons button').nth(index).click()
    settled(page)


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(
        executable_path=shutil.which('chromium') or shutil.which('chromium-browser'),
        args=['--no-sandbox'],
    )
    context = browser.new_context(viewport={'width': 1440, 'height': 1000})
    # The renderer is checked separately; keep these interaction checks deterministic.
    context.add_init_script('Object.defineProperty(navigator,"connection",{value:{saveData:true}})')
    page = context.new_page()
    errors = []
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.goto(args.url, wait_until='networkidle')
    page.evaluate('document.fonts.ready')
    page.locator('.project-pages').scroll_into_view_if_needed()
    settled(page)
    check('Only one project is visible initially', page.locator('.project-card:visible').count() == 1)
    check('Previous is disabled on the first page', page.locator('#project-previous').is_disabled())
    check('Five numbered pages are available', page.locator('.project-page-buttons button').count() == 5)

    # Native document scrolling drives the same page state as the manual controls.
    geometry = page.evaluate('''()=>{const t=document.querySelector('.project-scroll-track');return {active:t.classList.contains('project-scroll-active'),top:t.getBoundingClientRect().top+scrollY,height:t.getBoundingClientRect().height,sticky:parseFloat(t.style.getPropertyValue('--project-sticky-top')),step:parseFloat(t.querySelectorAll('.project-scroll-step')[1].style.top)}}''')
    check('Scroll pagination is enabled when the notebook fits', geometry['active'])
    start = geometry['top'] - geometry['sticky'] + 8
    page.evaluate('(y)=>scrollTo({top:y,behavior:"instant"})', start)
    page.wait_for_timeout(100)
    page.mouse.move(600, 300)
    page.mouse.wheel(0, geometry['step'] + 12)
    page.wait_for_function('document.querySelector(".project-pager").dataset.page==="2"')
    settled(page)
    check('Scrolling down advances the project', page.locator('.project-pager').get_attribute('data-page') == '2')
    check('Wheel scrolling still moves the native document', page.evaluate('scrollY') > start)
    page.mouse.wheel(0, -geometry['step'] - 12)
    page.wait_for_function('document.querySelector(".project-pager").dataset.page==="1"')
    settled(page)
    check('Scrolling up returns to the previous project', page.locator('.project-pager').get_attribute('data-page') == '1')
    select(page, 2)
    expected = geometry['top'] + 2 * geometry['step'] - geometry['sticky'] + 3
    check('Numbered buttons synchronize the scroll position', abs(page.evaluate('scrollY') - expected) < 2)
    page.mouse.wheel(0, geometry['step'] + 8)
    page.wait_for_function('document.querySelector(".project-pager").dataset.page==="4"')
    settled(page)
    check('Scrolling continues from a manually selected page', page.locator('.project-pager').get_attribute('data-page') == '4')
    select(page, 4)
    page.evaluate('(y)=>scrollTo({top:y,behavior:"instant"})', geometry['top'] + geometry['height'] - geometry['sticky'] + 160)
    page.wait_for_timeout(100)
    check('The notebook releases after the last project', page.locator('.project-pager').bounding_box()['y'] < 0)
    check('The archive remains reachable through native scrolling', page.locator('#archive').bounding_box()['y'] < 1000)
    page.evaluate('(y)=>scrollTo({top:y,behavior:"instant"})', start + 3 * geometry['step'])
    page.wait_for_function('document.querySelector(".project-pager").dataset.page==="4"')
    settled(page)
    check('Re-entering the work chapter restores the scroll page', page.locator('.project-pager').get_attribute('data-page') == '4')

    for index, key in enumerate(['memo', 'drawing', 'keyboard', 'paywall', 'media']):
        select(page, index)
        check(f'{key}: current page and counter match', page.locator('.project-pager').get_attribute('data-page') == str(index + 1) and page.locator('#project-page-number').inner_text() == f'{index + 1:02}')
        check(f'{key}: only the selected project can receive focus', page.locator('.project-card:not([inert])').count() == 1 and page.locator(f'.card-{key}').is_visible())
        page.locator(f'[data-project="{key}"]').click()
        check(f'{key}: case study opens', page.locator('#project-dialog').evaluate('(e)=>e.open'))
        page.keyboard.press('Escape')
        check(f'{key}: focus returns to this page', page.locator(f'[data-project="{key}"]').evaluate('(e)=>e===document.activeElement'))

    check('Next is disabled on the final page', page.locator('#project-next').is_disabled())
    page.locator('.project-page-buttons button').last.focus()
    page.keyboard.press('Home'); settled(page)
    check('Home returns to the first page', page.locator('.project-pager').get_attribute('data-page') == '1')
    page.keyboard.press('ArrowRight'); settled(page)
    check('Right arrow selects the next page', page.locator('.project-pager').get_attribute('data-page') == '2')
    page.keyboard.press('ArrowLeft'); settled(page)
    check('Left arrow selects the previous page', page.locator('.project-pager').get_attribute('data-page') == '1')
    page.keyboard.press('End'); settled(page)
    check('End selects the final page', page.locator('.project-pager').get_attribute('data-page') == '5')
    check('Keyboard focus follows the numbered page', page.locator('.project-page-buttons button').last.evaluate('(e)=>e===document.activeElement'))
    check('Screen-reader announcement identifies the page', 'Project 5 of 5: Media Manager' in page.locator('#project-page-announcement').inner_text())

    # Interrupt animations deliberately instead of waiting for each page turn.
    page.evaluate('''()=>{const b=document.querySelectorAll('.project-page-buttons button');b[1].click();b[4].click();b[0].click();b[3].click()}''')
    settled(page)
    check('Rapid navigation settles on the latest request', page.locator('.project-pager').get_attribute('data-page') == '4' and page.locator('.project-card:visible').count() == 1)
    page.evaluate('document.querySelectorAll(".project-page-buttons button")[2].click()')
    page.locator('#motion-toggle').click()
    check('Pause finishes an in-flight transition', not page.locator('.project-pager').get_attribute('data-transitioning') and page.locator('.project-card:visible').count() == 1)
    select(page, 4)
    check('Paused pagination remains usable without animation', page.locator('.project-pager').get_attribute('data-page') == '5')
    page.locator('#motion-toggle').click()
    page.emulate_media(reduced_motion='reduce')
    select(page, 0)
    check('Reduced motion changes pages instantly', not page.locator('.project-pager').get_attribute('data-transitioning'))
    page.evaluate('(y)=>scrollTo({top:y,behavior:"instant"})', start + geometry['step'])
    page.wait_for_function('document.querySelector(".project-pager").dataset.page==="2"')
    check('Reduced motion preserves scroll navigation without transitions', not page.locator('.project-pager').get_attribute('data-transitioning'))
    page.emulate_media(reduced_motion='no-preference')

    for width in [320, 390, 700, 768, 1024, 1440]:
        page.set_viewport_size({'width': width, 'height': 950})
        page.wait_for_timeout(180)
        heights = []
        for index in range(5):
            select(page, index)
            heights.append(round(page.locator('.project-pages').bounding_box()['height']))
        check(f'{width}px: page height stays stable', max(heights) - min(heights) <= 1)
        check(f'{width}px: no horizontal overflow', page.evaluate('document.documentElement.scrollWidth<=innerWidth'))
        check(f'{width}px: page buttons retain 48px targets', page.locator('.project-page-buttons button').evaluate_all('(els)=>els.every(e=>{const r=e.getBoundingClientRect();return r.width>=48 && r.height>=48})'))

    page.set_viewport_size({'width': 320, 'height': 568})
    page.wait_for_timeout(200)
    check('Short viewports avoid clipping the sticky notebook', not page.locator('.project-scroll-track').evaluate('(e)=>e.classList.contains("project-scroll-active")'))
    select(page, 1)
    check('Short viewports retain manual pagination', page.locator('.project-pager').get_attribute('data-page') == '2')
    page.set_viewport_size({'width': 1440, 'height': 1000})
    page.wait_for_timeout(200)

    page.emulate_media(media='print')
    check('Printing includes all five projects', page.locator('.project-card:visible').count() == 5)
    page.emulate_media(media='screen')
    static = browser.new_context(java_script_enabled=False, viewport={'width': 390, 'height': 844})
    fallback = static.new_page(); fallback.goto(args.url)
    check('Without JavaScript all five projects remain visible', fallback.locator('.project-card:visible').count() == 5)
    check('Without JavaScript pagination controls stay hidden', not fallback.locator('.project-pagination').is_visible())
    static.close()

    mobile = browser.new_context(viewport={'width': 390, 'height': 844}, is_mobile=True, has_touch=True)
    mobile.add_init_script('Object.defineProperty(navigator,"connection",{value:{saveData:true}})')
    touch_page = mobile.new_page(); touch_page.goto(args.url, wait_until='networkidle')
    touch_page.evaluate('document.fonts.ready')
    touch_page.locator('.project-pages').evaluate('(e)=>e.scrollIntoView({block:"start",behavior:"instant"})')
    session = mobile.new_cdp_session(touch_page)

    def swipe(start, end):
        session.send('Input.dispatchTouchEvent', {'type': 'touchStart', 'touchPoints': [{'x': start[0], 'y': start[1]}]})
        for step in range(1, 9):
            session.send('Input.dispatchTouchEvent', {'type': 'touchMove', 'touchPoints': [{'x': start[0] + (end[0] - start[0]) * step / 8, 'y': start[1] + (end[1] - start[1]) * step / 8}]})
        session.send('Input.dispatchTouchEvent', {'type': 'touchEnd', 'touchPoints': []})
        settled(touch_page)

    swipe((290, 230), (100, 230))
    check('A left swipe opens the next project', touch_page.locator('.project-pager').get_attribute('data-page') == '2')
    swipe((100, 230), (290, 230))
    check('A right swipe returns to the previous project', touch_page.locator('.project-pager').get_attribute('data-page') == '1')
    check('Swiping never opens a case-study dialog', not touch_page.locator('#project-dialog').evaluate('(e)=>e.open'))
    before = touch_page.evaluate('scrollY')
    swipe((200, 400), (200, 220))
    check('Vertical gestures keep native scrolling', touch_page.evaluate('scrollY') > before and touch_page.locator('.project-pager').get_attribute('data-page') == '1')
    check('No JavaScript errors', not errors)
    browser.close()

print(f'{count} project pagination checks passed.')
