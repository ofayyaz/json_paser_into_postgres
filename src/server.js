const { ApolloServer } = require('@apollo/server');
const app = require('./app');  // Import the configured Express app
const schema = require('./schema');  // Ensure the schema is ready
const { expressMiddleware } = require('@apollo/server/express4');

const startServer = async () => {
    const server = new ApolloServer({
      schema,
    });

    await server.start();

    app.use('/graphql', expressMiddleware(server));

    app.listen(4000, () => {
        console.log('Server is running on http://localhost:4000/graphql');
        console.log('GraphiQL is available at http://localhost:4000/graphiql');
    });
};

startServer();
