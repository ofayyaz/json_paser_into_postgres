// Import the Prisma client instance
const prisma = require('../prisma/prismaClient')

// ProductOptionType resolver
const ProductOptionType = {
    options: async (parent) => {
        try {
            return await prisma.productOption.findMany({
                where: { typeId: parent.id }
            });
        } catch (error) {
            console.error("Failed to retrieve product options:", error);
            throw new Error('Failed to retrieve product options.');
        }
    }
};

module.exports = ProductOptionType;
