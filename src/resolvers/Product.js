// Import the Prisma client instance
const prisma = require('../prisma/prismaClient')

// Product resolvers
const Product = {
    category: async (parent) => {
        try {
            return await prisma.category.findUnique({
                where: { id: parent.categoryId }
            });
        } catch (error) {
            console.error("Failed to retrieve category for product:", error);
            throw new Error('Failed to retrieve category.');
        }
    },
    subCategory: async (parent) => {
        try {
            return await prisma.subCategory.findUnique({
                where: { id: parent.subCategoryId }
            });
        } catch (error) {
            console.error("Failed to retrieve subcategory for product:", error);
            throw new Error('Failed to retrieve subcategory.');
        }
    },
    productImages: async (parent) => {
        try {
            return await prisma.productImage.findMany({
                where: { productId: parent.id }
            });
        } catch (error) {
            console.error("Failed to retrieve product images:", error);
            throw new Error('Failed to retrieve product images.');
        }
    },
    productOptions: async (parent) => {
        try {
            return await prisma.productOption.findMany({
                where: { productId: parent.id }
            });
        } catch (error) {
            console.error("Failed to retrieve product options:", error);
            throw new Error('Failed to retrieve product options.');
        }
    }
};

module.exports = Product;
