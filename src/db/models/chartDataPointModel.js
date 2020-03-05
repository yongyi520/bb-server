import mongoose, { Schema } from 'mongoose'

const chartDataPointSchema = new Schema({
  exchange: {
    type: String,
    required: true
  },
  symbol: {
    type: String,
    required: true
  },
  timeFrame: {
    type: Number,
    required: true
  },
  timeFrameUnit: {
    type: String,
    required: true
  },
  epochTime: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  typePeriod: {
    type: Number
  },
  value: {
    type: Number,
    required: true
  },
  dataEntryType: {
    type: String
  }
})

const ChartDataPoint = mongoose.model('ChartDataPoint', chartDataPointSchema)

export default ChartDataPoint