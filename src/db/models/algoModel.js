import mongoose, { Schema } from 'mongoose'

const algoSchema = new Schema({
  exchange: {
    type: String,
    required: true
  },
  symbol: {
    type: String,
    required: true
  },
  name: {
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
  additionalInfo: {
    type: [Number]
  },
  status: {
    type: String,
    required: true
  },
  executedNum: {
    type: Number,
    required: true
  },
  maxExecution: {
    type: Number,
    required: true
  },
  entryOrder: {
    type: Schema.Types.ObjectId,
    ref: 'Order'
  },
  stopLossOrder: {
    type: Schema.Types.ObjectId,
    ref: 'Order'
  },
  profitOrder: {
    type: Schema.Types.ObjectId,
    ref: 'Order'
  }
})

const Algo = mongoose.model('Algo', algoSchema)

export default Algo