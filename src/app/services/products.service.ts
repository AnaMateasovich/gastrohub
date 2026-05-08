export const getProductsService = async () => {
  try {
    const res = await fetch("/api/products", {
      method: "GET",
    });

    if (!res.ok) throw new Error("Error al intentar obtener los productos");

    return res.json();
  } catch (error) {
    return console.error(error)
  }
};
export const deleteProductAndRecipe = async (productId: number) => {
  try {
    const res = await fetch(`/api/products/${productId}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Error al eliminar el producto y la receta");
    return;
  } catch (error) {
    console.error(error)
  }
};
