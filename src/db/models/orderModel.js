import mongoose, { Schema } from 'mongoose'

const orderSchema = new Schema({
  exchange: {
    type: String,
    required: true
  },
  symbol: {
    type: String,
    required: true
  },
  orderId: {
    type: String
  },
  side: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  stopPrice: {
    type: Number
  }
})
const Order = mongoose.model('Order', orderSchema)
// const Order = (mongooseConnection) => {
//   return mongooseConnection.model('Order', orderSchema)
// }

export default Order