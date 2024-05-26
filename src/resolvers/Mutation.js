// Import the Prisma client instance
const prisma = require('../prisma/prismaClient')

// User resolvers handling fields that may require specific logic or database access
const Mutation= {
  createUser: (parent, args) => prisma.user.create({
    data: {
      email: args.email,
      password: args.password,
      name: args.name,
    },
  }),
  createProduct: (parent, args) => prisma.product.create({
    data: {
      name: args.name,
      description: args.description,
      price: args.price,
      category: { connect: { id: args.categoryId } },
      subCategory: { connect: { id: args.subCategoryId } },
      imageUrl: args.imageUrl,
    },
  }),
  createCategory: (parent, args) => prisma.category.create({
    data: {
      name: args.name,
    },
  }),
  createSubCategory: (parent, args) => prisma.subCategory.create({
    data: {
      name: args.name,
      category: { connect: { id: args.categoryId } },
    },
  }),
};

module.exports = Mutation;
