// Import the Prisma client instance
const prisma = require('../prisma/prismaClient')

// User resolvers
const User = {
    carts: async (parent) => {
        try {
            return await prisma.cart.findMany({
                where: { userId: parent.id }
            });
        } catch (error) {
            console.error("Failed to retrieve carts for user:", error);
            throw new Error('Failed to retrieve carts.');
        }
    },
    orders: async (parent) => {
        try {
            return await prisma.order.findMany({
                where: { userId: parent.id }
            });
        } catch (error) {
            console.error("Failed to retrieve orders for user:", error);
            throw new Error('Failed to retrieve orders.');
        }
    }
};

module.exports = User;
