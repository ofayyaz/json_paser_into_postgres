// Import the Prisma client instance

const prisma = require('../prisma/prismaClient')

// Cart resolver
const Cart = {
    user: async (parent) => {
        try {
            return await prisma.user.findUnique({
                where: { id: parent.userId }
            });
        } catch (error) {
            console.error("Failed to retrieve user for cart:", error);
            throw new Error('Failed to retrieve user.');
        }
    },
    cartItems: async (parent) => {
        try {
            return await prisma.cartItem.findMany({
                where: { cartId: parent.id }
            });
        } catch (error) {
            console.error("Failed to retrieve cart items for cart:", error);
            throw new Error('Failed to retrieve cart items.');
        }
    }
};

module.exports = Cart;
