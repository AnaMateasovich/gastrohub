import os
import uuid
import pytest
from playwright.sync_api import expect

@pytest.fixture
def test_create_product_manual_cost(owner_page):
    unique_id = uuid.uuid4().hex[:8]
    product_name = f"Pan de campo test {unique_id}"
    slug = f"pan-de-campo-test-{unique_id}"

    owner_page.goto("/admin/productos/crear") 

    # --- Paso 1: datos del producto ---
    owner_page.get_by_placeholder("Nombre").fill(product_name)
    owner_page.get_by_placeholder("Descripción").fill("Pan artesanal de campo, 1kg")
    owner_page.get_by_placeholder("Slug").fill(slug)
    owner_page.get_by_placeholder("Precio").fill("2500")

    owner_page.locator("select").select_option("kg")  # saleUnit
    owner_page.get_by_placeholder("Cantidad por unidad (ej: 0.5, 1, 6)").fill("1")
    owner_page.get_by_placeholder("Costo extra (packaging, etiqueta, etc)").fill("100")

    # Imagen obligatoria 
    image_path = os.path.join(os.path.dirname(__file__), "fixtures", "test-image.jpg")
    owner_page.locator('input[type="file"]').set_input_files(image_path)

    owner_page.get_by_role("button", name="Siguiente →").click()

    # --- Paso 2: costeo ---
    owner_page.get_by_text("Costo manual").click()
    owner_page.get_by_placeholder("Costo del producto (ej: 400)").fill("800")

    owner_page.get_by_role("button", name="Crear").click()

    # --- Assert ---
    owner_page.wait_for_url("**/admin/productos")
    expect(owner_page.get_by_text(product_name, exact=True)).to_be_visible()

    return {"slug": slug, "name": product_name}

def test_edit_product(owner_page, test_create_product_manual_cost):
    slug = test_create_product_manual_cost["slug"]

    owner_page.get_by_test_id(f"product-menu-toggle-{slug}").click()
    owner_page.get_by_test_id(f"product-edit-{slug}").click()

    owner_page.wait_for_url(lambda url: f"/admin/productos/{slug}/editar" in url)

    owner_page.get_by_test_id("product-form-step-1-editar").get_by_placeholder("Precio").fill("3000")

    owner_page.get_by_role("button", name="Guardar cambios").click()

  # --- Assert ---
    owner_page.wait_for_url(lambda url: "/admin/productos" in url and "editar" not in url)
    expect(owner_page.get_by_test_id(f"product-card-{slug}")).to_contain_text("3000")

def test_desactivate_product(owner_page, test_create_product_manual_cost):
    slug = test_create_product_manual_cost["slug"]

    owner_page.get_by_test_id(f"product-menu-toggle-{slug}").click()

    owner_page.get_by_test_id(f"product-activate-{slug}").click()

    owner_page.goto(f"/admin/productos/{slug}") 
    
    expect(owner_page.get_by_text("Inactivo", exact=True)).to_be_visible()

def test_delete_product(owner_page, test_create_product_manual_cost):
    slug = test_create_product_manual_cost["slug"]
    product_name = test_create_product_manual_cost["name"]

    owner_page.get_by_test_id(f"product-menu-toggle-{slug}").click()

    owner_page.once("dialog", lambda dialog: dialog.accept())

    owner_page.get_by_test_id(f"product-delete-{slug}").click()


    expect(owner_page.get_by_text(product_name, exact=True)).not_to_be_visible()