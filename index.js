const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');
const { graphqlHTTP } = require('express-graphql');

const prisma = new PrismaClient();

const typeDefs = `
  type User {
    id: Int!
    email: String!
    name: String
    carts: [Cart!]!
    orders: [Order!]!
  }

  type Product {
    id: Int!
    name: String!
    description: String!
    price: Float!
    imageUrl: String
    category: Category!
    subCategory: SubCategory!
    productImages: [ProductImage!]!
    productOptions: [ProductOption!]!
  }

  type ProductImage {
    id: Int!
    imageUrl: String!
    product: Product!
  }

  type Category {
    id: Int!
    name: String!
    products: [Product!]!
    subCategories: [SubCategory!]!
  }

  type SubCategory {
    id: Int!
    name: String!
    category: Category!
    products: [Product!]!
  }

  type ProductOptionType {
    id: Int!
    name: String!
    identifier: String!
    options: [ProductOption!]!
  }

  type ProductOption {
    id: Int!
    type: ProductOptionType!
    value: String!
    price: Float!
    product: Product!
  }

  type Cart {
    id: Int!
    user: User!
    cartItems: [CartItem!]!
    createdAt: String!
    updatedAt: String!
  }

  type CartItem {
    id: Int!
    cart: Cart!
    product: Product!
    quantity: Int!
    productOption: ProductOption!
  }

  type Order {
    id: Int!
    user: User!
    total: Float!
    status: String!
    orderItems: [OrderItem!]!
    createdAt: String!
  }

  type OrderItem {
    id: Int!
    order: Order!
    product: Product!
    price: Float!
    quantity: Int!
    productOption: ProductOption!
  }

  type Query {
    users: [User!]!
    user(id: Int!): User
    products: [Product!]!
    product(id: Int!): Product
    categories: [Category!]!
    subCategories: [SubCategory!]!
  }

  type Mutation {
    createUser(email: String!, password: String!, name: String): User!
    createProduct(name: String!, description: String!, price: Float!, categoryId: Int!, subCategoryId: Int!, imageUrl: String): Product!
    createCategory(name: String!): Category!
    createSubCategory(name: String!, categoryId: Int!): SubCategory!
  }
`;

const resolvers = {
  Query: {
    users: () => prisma.user.findMany(),
    user: (parent, args) => prisma.user.findUnique({ where: { id: args.id } }),
    products: () => prisma.product.findMany(),
    product: (parent, args) => prisma.product.findUnique({ where: { id: args.id } }),
    categories: () => prisma.category.findMany(),
    subCategories: () => prisma.subCategory.findMany(),
  },
  Mutation: {
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
  },
  User: {
    carts: (parent) => prisma.cart.findMany({ where: { userId: parent.id } }),
    orders: (parent) => prisma.order.findMany({ where: { userId: parent.id } }),
  },
  Product: {
    category: (parent) => prisma.category.findUnique({ where: { id: parent.categoryId } }),
    subCategory: (parent) => prisma.subCategory.findUnique({ where: { id: parent.subCategoryId } }),
    productImages: (parent) => prisma.productImage.findMany({ where: { productId: parent.id } }),
    productOptions: (parent) => prisma.productOption.findMany({ where: { productId: parent.id } }),
  },
  Category: {
    products: (parent) => prisma.product.findMany({ where: { categoryId: parent.id } }),
    subCategories: (parent) => prisma.subCategory.findMany({ where: { categoryId: parent.id } }),
  },
  SubCategory: {
    category: (parent) => prisma.category.findUnique({ where: { id: parent.categoryId } }),
    products: (parent) => prisma.product.findMany({ where: { subCategoryId: parent.id } }),
  },
  ProductOptionType: {
    options: (parent) => prisma.productOption.findMany({ where: { typeId: parent.id } }),
  },
  ProductOption: {
    type: (parent) => prisma.productOptionType.findUnique({ where: { id: parent.typeId } }),
    product: (parent) => prisma.product.findUnique({ where: { id: parent.productId } }),
  },
  Cart: {
    user: (parent) => prisma.user.findUnique({ where: { id: parent.userId } }),
    cartItems: (parent) => prisma.cartItem.findMany({ where: { cartId: parent.id } }),
  },
  CartItem: {
    cart: (parent) => prisma.cart.findUnique({ where: { id: parent.cartId } }),
    product: (parent) => prisma.product.findUnique({ where: { id: parent.productId } }),
    productOption: (parent) => prisma.productOption.findUnique({ where: { id: parent.productOptionId } }),
  },
  Order: {
    user: (parent) => prisma.user.findUnique({ where: { id: parent.userId } }),
    orderItems: (parent) => prisma.orderItem.findMany({ where: { orderId: parent.id } }),
  },
  OrderItem: {
    order: (parent) => prisma.order.findUnique({ where: { id: parent.orderId } }),
    product: (parent) => prisma.product.findUnique({ where: { id: parent.productId } }),
    productOption: (parent) => prisma.productOption.findUnique({ where: { id: parent.productOptionId } }),
  },
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const startServer = async () => {
    const server = new ApolloServer({
      schema,
    });
  
await server.start();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/graphql', expressMiddleware(server));

app.use('/graphiql', graphqlHTTP({
    schema,
    graphiql: true,
  }));

app.listen(4000, () => {
    console.log('Server is running on http://localhost:4000/graphql');
    console.log('GraphiQL is available at http://localhost:4000/graphiql');
  });
};

startServer();