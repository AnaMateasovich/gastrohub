export type Ingredient = {
    id: number
    name: string
    unit: string
    price: number
    stock: number
    updatedAt: Date
}

export type IngredientPriceHistory= {
    id: number
    ingredientId: number
    price: number
    createdAt: Date
    ingredient: Ingredient
}