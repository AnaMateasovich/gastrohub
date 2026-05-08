export const getRecipes = async () => {
  try {
    const res = await fetch("/api/recipes", {
      method: "GET",
    });
    if (!res.ok) throw new Error("Error al intentar obtener las recetas");

    return res.json();
  } catch (error) {
    console.error(error);
  }
};

