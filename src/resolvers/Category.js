// Import the Prisma client instance
const prisma = require('../prisma/prismaClient')

// Category resolvers
const Category = {
    products: async (parent) => {
        try {
            return await prisma.product.findMany({
                where: { categoryId: parent.id }
            });
        } catch (error) {
            console.error("Failed to retrieve products for category:", error);
            throw new Error('Failed to retrieve products.');
        }
    },
    subCategories: async (parent) => {
        try {
            return await prisma.subCategory.findMany({
                where: { categoryId: parent.id }
            });
        } catch (error) {
            console.error("Failed to retrieve subcategories for category:", error);
            throw new Error('Failed to retrieve subcategories.');
        }
    }
};

module.exports = Category;
