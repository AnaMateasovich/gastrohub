import os
import pytest
from dotenv import load_dotenv
from playwright.sync_api import sync_playwright

load_dotenv()
BASE_URL = os.getenv("BASE_URL", "http://localhost:3000")

@pytest.fixture(scope="function")
def page():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)  
        context = browser.new_context(base_url=BASE_URL)
        page = context.new_page()
        yield page
        context.close()
        browser.close()

@pytest.fixture
def owner_page(page):
    """Página ya logueada como OWNER."""
    page.goto("/login")
    page.fill('input[name="email"]', os.getenv("TEST_OWNER_EMAIL"))
    page.fill('input[name="password"]', os.getenv("TEST_OWNER_PASSWORD"))
    page.click('button[type="submit"]')
    page.wait_for_url("**/home**") 
    return page