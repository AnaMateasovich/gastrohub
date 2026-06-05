import { ChefHat } from "lucide-react";
import { RecipeType } from "../../types/recipe.type";
import { getDisplayUnit, toDisplayUnit } from "@/src/lib/units";

type Props = {
  recipe: RecipeType;
};

const RecipeProduct = ({ recipe }: Props) => {

  console.log(recipe)
  return (
    <div style={{ marginTop: "1.5rem" }}>
      <div className="flex items-center gap-2 mb-3">
        <ChefHat size={18} strokeWidth={1.5} color="#3A7D44" />
        <span className="text-[15px] font-medium">{recipe.name}</span>
        <span className="ml-auto text-xs bg-[var(--color-natural-bg)] text-[var(--color-primary-dark)] px-3 py-1 rounded-full">
          Rinde {recipe.yield} {recipe.yieldUnit}
        </span>
      </div>

      <div className="border border-[var(--color-border)] rounded-xl overflow-hidden">
        <table className="w-full text-[13px] border-collapse" style={{ tableLayout: "fixed" }}>
          <thead>
            <tr className="bg-[var(--color-natural-bg)]">
              <th className="text-left px-3 py-2 font-medium text-[var(--color-primary-dark)] w-[45%]">Ingrediente</th>
              <th className="text-right px-3 py-2 font-medium text-[var(--color-primary-dark)] w-[25%]">Cantidad</th>
              <th className="text-right px-3 py-2 font-medium text-[var(--color-primary-dark)] w-[30%]">Costo</th>
            </tr>
          </thead>
          <tbody>
            {recipe.items.map((item, i) => (
              <tr
                key={item.id}
                className={`border-t border-[var(--color-border)] ${i % 2 !== 0 ? "bg-gray-50" : ""}`}
              >
                <td className="px-3 py-2">{item.ingredient.name}</td>
                <td className="px-3 py-2 text-right text-[var(--color-text-secondary)]">
                  {toDisplayUnit(Number(item.quantity), item.unit)} {getDisplayUnit(item.unit)}
                </td>
                <td className="px-3 py-2 text-right">
                  ${Math.round(item.quantity * item.ingredient.price)}
                </td>
              </tr>
            ))}
            <tr className="border-t border-[var(--color-border)] bg-[var(--color-natural-bg)]">
              <td className="px-3 py-2 font-medium text-[var(--color-primary-dark)]">Total receta</td>
              <td />
              <td className="px-3 py-2 text-right font-medium text-[var(--color-primary-dark)]">
                ${Math.round(recipe.items.reduce((acc, item) => acc + item.quantity * item.ingredient.price, 0))}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecipeProduct;