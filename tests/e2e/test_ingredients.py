import pytest
from playwright.sync_api import expect

@pytest.fixture
def test_create_ingredient(owner_page):
    ingredient_name = "Levadura"

    owner_page.goto("/admin/menu/insumos/crear") 

    owner_page.get_by_placeholder("Nombre").fill(ingredient_name)
    owner_page.get_by_placeholder("Precio").fill("5000")
    owner_page.locator("select").select_option("kg")

    owner_page.get_by_role("button", name="Crear", exact=True).click()

    owner_page.wait_for_url("**/admin/menu/insumos")
    expect(owner_page.get_by_text(ingredient_name, exact=True)).to_be_visible()

    return {"nombre": ingredient_name}


def test_edit_ingredient(owner_page, test_create_ingredient):
    ingredient_name = test_create_ingredient["nombre"]

    owner_page.goto("/admin/menu/insumos") 

    owner_page.get_by_test_id(f"edit-button-{ingredient_name}").click()

    owner_page.wait_for_url(lambda url: f"/editar" in url)

    owner_page.get_by_placeholder("Stock").fill("2")

    owner_page.get_by_role("button", name="Editar", exact=True).click()

    expect(owner_page.get_by_test_id(f"ingredient-stock-{ingredient_name}")).to_have_text("2 kg")

def test_delete_ingredient(owner_page, test_create_ingredient):
    ingredient_name = test_create_ingredient["nombre"]

    owner_page.goto("/admin/menu/insumos") 

    owner_page.once("dialog", lambda dialog: dialog.accept())

    owner_page.get_by_test_id(f"delete-button-{ingredient_name}").click()

    expect(owner_page.get_by_text(ingredient_name, exact=True)).not_to_be_visible()
  