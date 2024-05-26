// Import the Prisma client instance
const prisma = require('../prisma/prismaClient')

// CartItem resolvers
const CartItem = {
    cart: async (parent, args, context) => {
        try {
            return await prisma.cart.findUnique({
                where: { id: parent.cartId }
            });
        } catch (error) {
            console.error("Failed to retrieve cart for cart item:", error);
            throw new Error('Failed to retrieve cart.');
        }
    },
    product: async (parent, args, context) => {
        try {
            return await prisma.product.findUnique({
                where: { id: parent.productId }
            });
        } catch (error) {
            console.error("Failed to retrieve product for cart item:", error);
            throw new Error('Failed to retrieve product.');
        }
    },
    productOption: async (parent, args, context) => {
        try {
            return await prisma.productOption.findUnique({
                where: { id: parent.productOptionId }
            });
        } catch (error) {
            console.error("Failed to retrieve product option for cart item:", error);
            throw new Error('Failed to retrieve product option.');
        }
    },
    // Additional fields can be added here if necessary
};

module.exports = CartItem;
