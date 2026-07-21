def test_login(owner_page):
    owner_page.goto("/admin")

    assert owner_page.url.endswith("/admin")