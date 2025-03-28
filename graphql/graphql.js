const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const { readFileSync } = require("fs");
const { join } = require("path");
const resolvers = require("./resolvers");
const bodyParser = require("body-parser");
const cors = require("cors");

const typeDefs = readFileSync(join(__dirname, "schema.graphql"), "utf8");

const createApolloServer = async (app) => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  app.use(
    "/graphql",
    cors(),
    bodyParser.json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({ req }),
    })
  );

  console.log(
    `GraphQL server running at: http://localhost:${
      process.env.PORT || 3000
    }/graphql`
  );

  return server;
};

module.exports = { createApolloServer };
