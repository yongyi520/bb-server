import { gql } from "apollo-server-express";


export default gql`
  type ChartDataPoint {
    id: ID
    exchange: String
    symbol: String 
    timeFrame: Int
    timeFrameUnit: String
    epochTime: Int
    type: String
    typePeriod: Int
    value: Float
  }

  input ChartDataPointInput {
    exchange: String!
    symbol: String !
    timeFrame: Int!
    timeFrameUnit: String!
    epochTime: Int!
    type: String!
    typePeriod: Int
    value: Float!
  }

  extend type Query {
    epochTimeToDate(epochTime: Int): Boolean    
    getChartDataPoints: [ChartDataPoint]
  }
  extend type Mutation {
    addChartDataPoint(data: ChartDataPointInput): Boolean
    calculateBitmexEMADaily: Boolean
  }
`