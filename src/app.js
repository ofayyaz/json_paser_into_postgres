const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const cors = require('cors');
const bodyParser = require('body-parser');
const schema = require('./schema');  // Assumes schema setup is exported from a 'schema' directory

const app = express();
app.use(cors());
app.use(bodyParser.json());



app.use('/graphiql', graphqlHTTP({
  schema,
  graphiql: true,
}));

module.exports = app;