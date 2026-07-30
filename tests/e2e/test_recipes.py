import pytest
from playwright.sync_api import expect

@pytest.fixture
def test_create_recipe(owner_page):
    recipe_name = "Cookie de avena"

    owner_page.goto("/admin/menu/recetas/crear") 

    owner_page.get_by_placeholder("Nombre de la receta").fill(recipe_name)
    owner_page.get_by_placeholder("¿Cuánto rinde esta receta? ej: 3").fill("5")
    owner_page.locator('select[name="yieldUnit"]').select_option("Unidades (u)")
    owner_page.get_by_test_id("items-0").select_option("Harina 0000 (g)")
    owner_page.locator('input[name="items.0.quantity"]').fill("500")
    owner_page.get_by_role("button", name="+ Agregar ingrediente", exact=True).click()
    owner_page.get_by_test_id("items-1").select_option("Azucar (g)")
    owner_page.locator('input[name="items.1.quantity"]').fill("100")

    owner_page.get_by_role("button", name="Crear", exact=True).click()
    owner_page.wait_for_url("/admin/menu/recetas")
    expect(owner_page.get_by_text(recipe_name, exact=True)).to_be_visible()

    return {"nombre": recipe_name}


def test_edit_recipe(owner_page, test_create_recipe):
    recipe_name = test_create_recipe["nombre"]

    owner_page.goto("/admin/menu/recetas") 

    owner_page.get_by_test_id(f"btn-options-{recipe_name}").click()

    owner_page.get_by_test_id(f"btn-edit-{recipe_name}").click()

    owner_page.wait_for_url(lambda url: f"/editar" in url)

    owner_page.get_by_placeholder("¿Cuánto rinde esta receta? ej: 3").fill("3")

    owner_page.get_by_role("button", name="Actualizar", exact=True).click()

    expect(owner_page.get_by_test_id(f"yeild-{recipe_name}")).to_have_text("3u")

def test_delete_recipe(owner_page, test_create_recipe):
    recipe_name = test_create_recipe["nombre"]

    owner_page.goto("/admin/menu/recetas") 

    owner_page.get_by_test_id(f"btn-options-{recipe_name}").click()

    owner_page.once("dialog", lambda dialog: dialog.accept())

    owner_page.get_by_test_id(f"btn-delete-{recipe_name}").click()

    expect(owner_page.get_by_text(recipe_name, exact=True)).not_to_be_visible()
  