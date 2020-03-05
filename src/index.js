import { startDB, models } from "./db";
import resolvers from "./graphql/resolvers";
import typeDefs from "./graphql/typeDefs";
import express from "express";
import { ApolloServer, gql } from "apollo-server-express";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();
const uri = process.env.DB_PATH;
startDB(uri) 
// mongoose.connect(uri, {
//   bufferCommands: false, // Disable mongoose buffering
//   bufferMaxEntries: 0, // and MongoDB driver buffering 
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useCreateIndex: true
// }) 
const context = async ({ ctx }) => {
  return {
    ctx
  };
};
const server = new ApolloServer({ typeDefs, resolvers, context }); 

const app = express();
server.applyMiddleware({ app });

app.listen({ port: process.env.PORT || 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
