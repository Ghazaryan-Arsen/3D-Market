
from playwright.sync_api import sync_playwright, Page, expect

def run(playwright):
    # Define a mobile viewport for iPhone 11.
    iphone_11 = playwright.devices['iPhone 11']

    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context(
        **iphone_11,
    )
    page = context.new_page()

    try:
        # Navigate to the homepage
        page.goto("file:///app/index.html")

        # Check that the mobile menu button is visible
        mobile_menu_button = page.locator("#mobile-menu-button")
        expect(mobile_menu_button).to_be_visible()

        # Click the mobile menu button to open the menu
        mobile_menu_button.click()

        # Check that the mobile menu is now visible
        mobile_menu = page.locator("#mobile-menu")
        expect(mobile_menu).to_be_visible()

        # Take a screenshot of the open menu on the homepage
        page.screenshot(path="jules-scratch/verification/mobile-homepage.png")

    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
