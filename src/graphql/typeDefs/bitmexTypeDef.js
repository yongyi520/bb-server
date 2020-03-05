import { gql } from "apollo-server-express";


export default gql`
  extend type Query {
    bitmexUserGetWallet: [String]
    bitmexAccouncement: String
    bitmexOrders: String
    bitmexPositions: String
  }

  extend type Mutation {
    bitmexAddOrder: Boolean
    bitmexUpdateOrder: Boolean
    bitmexDeleteOrder: Boolean
    bitmexAddBulkOrders: Boolean
    bitmexUpdateBulkOrders: Boolean
  }
`