// Import the Prisma client instance
const prisma = require('../prisma/prismaClient')

// ProductOption resolver
const ProductOption = {
    type: async (parent) => {
        try {
            return await prisma.productOptionType.findUnique({
                where: { id: parent.typeId }
            });
        } catch (error) {
            console.error("Failed to retrieve product option type:", error);
            throw new Error('Failed to retrieve product option type.');
        }
    },
    product: async (parent) => {
        try {
            return await prisma.product.findUnique({
                where: { id: parent.productId }
            });
        } catch (error) {
            console.error("Failed to retrieve product for product option:", error);
            throw new Error('Failed to retrieve product.');
        }
    }
};

module.exports = ProductOption;
