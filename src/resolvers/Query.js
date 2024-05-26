// Import the Prisma client instance
const prisma = require('../prisma/prismaClient')

// User resolvers handling fields that may require specific logic or database access
const Query = {
    users: () => prisma.user.findMany(),
    user: (_, args) => prisma.user.findUnique({ where: { id: args.id } }),
    products: () => prisma.product.findMany(),
    product: (_, args) => prisma.product.findUnique({ where: { id: args.id } }),
    productByName: (_,args)=>  prisma.product.findFirst({where: {name:args.name}}),
    categories: () => prisma.category.findMany(),
    subCategories: () => prisma.subCategory.findMany(),
    category: (_, args) => prisma.category.findUnique({ where: { id: args.id } }),
    categoryByName: (_,args)=>  prisma.category.findFirst({where: {name:args.name}})

  }

module.exports = Query;
