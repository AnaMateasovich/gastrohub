import { CostType } from "../types/cost.type";

export const getCosts = async (): Promise<CostType[]> => {
  try {
    const res = await fetch("/api/costs", {
      method: "GET",
    });
    if (!res.ok) throw new Error("Error al obtener los costos");
    return await res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};