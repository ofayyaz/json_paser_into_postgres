const typeDefs = require('./typeDefs/index');
const resolvers = require('./resolvers/index');
const { makeExecutableSchema } = require('@graphql-tools/schema');

const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });
  
module.exports = schema;

