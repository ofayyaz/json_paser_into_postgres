// Import the Prisma client instance
const prisma = require('../prisma/prismaClient')

// User resolvers 
const OrderItem= {
    order: (parent) => prisma.order.findUnique({ where: { id: parent.orderId } }),
    product: (parent) => prisma.product.findUnique({ where: { id: parent.productId } }),
    productOption: (parent) => prisma.productOption.findUnique({ where: { id: parent.productOptionId } }),
  };

module.exports = OrderItem;
