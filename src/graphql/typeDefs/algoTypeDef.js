import { gql } from "apollo-server-express";

export default gql`

  type Algo {
    id: ID
    exchange: String
    symbol: String
    name: String
    timeFrame: Int
    timeFrameUnit: String
    additionalInfo: [Float]
    status: String
    executedNum: Int
    maxExecution: Int
    entryOrder: Order
    stopLossOrder: Order
    profitOrder: Order
  }

  input AlgoInput {
    exchange: String
    symbol: String
    name: String
    timeFrame: Int
    timeFrameUnit: String
    additionalInfo: [Float]
    status: String
    executedNum: Int
    maxExecution: Int
    entryOrder: String
    stopLossOrder: String
    profitOrder: String
  }

  extend type Query {
    getHourlyData: Boolean
    calcEMA: Float
    checkAlgoOrderStatus(id: String!): Boolean
    getAlgos: [Algo]
  }

  extend type Mutation {
    runAlgo(id: String!): Boolean
    runAlgoUpdate(id: String!): Boolean
    turnOnAlgo(id: String!): Boolean
    turnOffAlgo(id: String!): Boolean
    addAlgo(data: AlgoInput!): Algo
    updateAlgo(id: String!, data: AlgoInput!): Algo
    deleteAlgo(id: String): Algo
  }
`;
