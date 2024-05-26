// Import the Prisma client instance
const prisma = require('../prisma/prismaClient')

// SubCategory resolvers
const SubCategory = {
    category: async (parent) => {
        try {
            return await prisma.category.findUnique({
                where: { id: parent.categoryId }
            });
        } catch (error) {
            console.error("Failed to retrieve category:", error);
            throw new Error('Failed to retrieve category.');
        }
    },
    products: async (parent) => {
        try {
            return await prisma.product.findMany({
                where: { subCategoryId: parent.id }
            });
        } catch (error) {
            console.error("Failed to retrieve products:", error);
            throw new Error('Failed to retrieve products.');
        }
    }
};

module.exports = SubCategory;
