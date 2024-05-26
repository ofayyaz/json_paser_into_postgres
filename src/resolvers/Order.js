// Import the Prisma client instance
const prisma = require('../prisma/prismaClient')

// Order resolvers
const Order = {
    user: async (parent, args, context) => {
        try {
            return await prisma.user.findUnique({
                where: { id: parent.userId }
            });
        } catch (error) {
            console.error("Failed to retrieve user for order:", error);
            throw new Error('Failed to retrieve user.');
        }
    },
    orderItems: async (parent, args, context) => {
        try {
            return await prisma.orderItem.findMany({
                where: { orderId: parent.id }
            });
        } catch (error) {
            console.error("Failed to retrieve order items for order:", error);
            throw new Error('Failed to retrieve order items.');
        }
    },
    // Additional fields can be added here if necessary
};

module.exports = Order;


