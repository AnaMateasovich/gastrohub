'use client'
import React, { useEffect, useState } from "react";
import IngredientCard from "../../../components/IngredientCard";
import { Ingredient } from "@prisma/client";

const IngredientsList = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);


  const handleDelete = async (id: number) => {
    setIngredients((prev) => prev.filter((i) => i.id !== id))
  }

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const res = await fetch("/api/ingredients", {
          method: "GET",
        });
        if (!res.ok) {
          throw new Error("Error al obtener los ingredientes");
        }
        const data = await res.json();
        setIngredients(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchIngredients();
  }, []);

  return (
    <div className="flex flex-col gap-2">
      {ingredients.map((i) => (
        <div key={i.id}>
          <IngredientCard
            ingredientId={i.id}
            name={i.name}
            unit={i.unit}
            price={Number(i.price)}
            stock={i.stock ? Number(i.stock) : undefined}
            onDelete={handleDelete}
          />
        </div>
      ))}
    </div>
  );
};

export default IngredientsList;
