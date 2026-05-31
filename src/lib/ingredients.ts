import { prisma } from "./prisma"

export const getIngredients = async () => {
    return prisma.ingredients.findMany()
}