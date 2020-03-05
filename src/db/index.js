import mongoose from 'mongoose'
import Algo from './models/algoModel'
import Order from './models/orderModel'
import ChartDataPoint from './models/chartDataPointModel'


let conn = null 

export const startDB = async (uri) => {
  if(conn == null) {
    try {
      conn = await mongoose.connect(uri, {
        // bufferCommands: false, // Disable mongoose buffering
        // bufferMaxEntries: 0, // and MongoDB driver buffering
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // useCreateIndex: true
      })
      console.log('connected to mongoDB')
    } catch (e) {
      console.log('error connecting to mongo', e)
      if (e.code === "ESERVFAIL") {
        setTimeout(() => startDB(uri), 2000);
      }
    }
    
  }

  return conn
}

export const models = {
  Algo,
  Order,
  ChartDataPoint
}