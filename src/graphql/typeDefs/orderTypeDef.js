import { gql } from "apollo-server-express";

export default gql`
  type Order {
    id: ID
    exchange: String
    symbol: String 
    orderID: String
    side: String 
    type: String 
    quantity: Int
    price: Float
    stopPrice: Float
  }

  input OrderInput {
    exchange: String!
    symbol: String !
    orderID: String
    side: String!
    type: String! 
    quantity: Int!
    price: Float!
    stopPrice: Float 
  }
`