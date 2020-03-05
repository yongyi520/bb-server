import _ from "lodash";
import CryptoCompare from "../../lib/cryptocompare/CryptoCompare";
import { getStartEMAEpochTime } from "../../lib/dateUtils";
import { calculateSlowAndFastEmaArray } from "../../lib/tradeUtils";
import Algo from "../../db/models/algoModel";
import { runBitmexFastEMAAlgo, runBitmexFastEMAAlgoUpdate } from "../../lib/runAlgos";
import Order from "../../db/models/orderModel";
import BitmexClient from "../../lib/bitmex/BitmexClient";
import { parseBitmexOrderResponse, checkAlgoOrdersStatus } from "../../lib/algoUtils";


export default {
  Query: {
    getHourlyData: async (_parent, _args, _context, _info) => {
      console.log("process.env.CRYPTOCOMPAREKEY", process.env.CRYPTOCOMPAREKEY);
      var cryptocompare = new CryptoCompare(process.env.CRYPTOCOMPAREKEY);
      // https://min-api.cryptocompare.com/data/v2/histohour?e=Bitmex&aggregate=2&fsym=XBTUSD&tsym=USD&limit=10
      const queries = {
        fsym: "XBTUSD",
        tsym: "USD",
        limit: 20,
        e: "Bitmex",
        aggregate: 2
      };
      const response = await cryptocompare.getHourlyData(queries);
      console.log("response", response.Data);
      console.log("time from", response.Data.TimeFrom);
      console.log("response.data.TimeTo", response.Data.TimeTo);
      const epochTime = getStartEMAEpochTime(response.Data.TimeTo)
      // epoch number * 1000 that includes milliseconds
      // let date = new Date(response.Data.TimeTo * 1000);
      // console.log("date", date);
      // date.setUTCHours(0);
      // console.log("date set utc hour to 0", date);
      // let epochTime = date.getTime() / 1000;
      console.log("date in utc seconds", epochTime);
      console.log('next midnight utc seconds', epochTime + 86400)
      // date.setUTCHours;
      // console.log(new Date(response.Data.TimeFrom))
      // console.log(new Date(response.Data.TimeTo))
      // 86400 seconds in a day, 86400000 miliseconds in a day
      // epochTime + 86400 = next day
    },
    calcEMA: async (_parent, _args, _context, _info) => {
      const queries = {
        fsym: "XBTUSD",
        tsym: "USD",
        limit: 30,
        e: "Bitmex",
        aggregate: 2
      };
      // get 2 hour histo hour
      var cryptocompare = new CryptoCompare(process.env.CRYPTOCOMPAREKEY);
      const response = await cryptocompare.getHourlyData(queries);
      const data = response.Data.Data;
      // get timeTo epoch time to date
      const startEpochTime = getStartEMAEpochTime(response.Data.TimeTo);
      console.log("start epoch time", startEpochTime);
      const startIndex = _.findIndex(data, d => d.time === startEpochTime);
      const dataArray = _.slice(data, startIndex, data.length - 1);
      console.log("data array", dataArray);
      const chartDataPointQuery = {
        exchange: "Bitmex",
        symbol: "XBTUSD",
        timeFrame: 2, 
        timeFrameUnit: "H",
        type: "EMA",
        epochTime: startEpochTime
      };
      const { slowEmaArray, fastEmaArray } = await calculateSlowAndFastEmaArray(
        dataArray,
        chartDataPointQuery
      );
      console.log('slow ema array', slowEmaArray)
      console.log('fast ema array', fastEmaArray)
    },
    checkAlgoOrderStatus: async (_parent, { id }, _context, _info) => {
      const algo = await Algo.findOne({_id: id})
      const orderStatuses = await checkAlgoOrdersStatus(algo)
      console.log('order statuses', orderStatuses)
    }
  },
  Mutation: {
    runAlgo: async (_parent, { id }, _context, _info) => { 
      // const algoId = "5e58a71d3139841094f91ed0"
      runBitmexFastEMAAlgo(id)  
    },
    runAlgoUpdate: async (_parent, { id }, _context, _info) => { 
      runBitmexFastEMAAlgoUpdate(id)
    },
    turnOnAlgo:  async (_parent, { id }, _context, _info) => { 
      let algo = null
      try {
        algo = await Algo.findOne({_id: id})
      } catch (e) {
        console.log('error finding algo', e)
      }
      
      try {
        if(algo && algo.status === 'off') {
          const response = await Algo.updateOne({_id: id}, {status: 'on', executedNum: 0})
          console.log('response', response)
          return response.n === 1
        } else {
          console.log('algo is already on, status now is: ', algo.status)
        }
        
      } catch (e) {
        console.log('error updating algo by turning it on')
      }
      
    },
    /**
     * delete the orders at hand, then turn the algo off
     * TODO: 
     * 1. check order statuses
     * 2. if order statuses are active, cancel them
     * 3. delete orders from database
     * 4. update the orders field on algo mongo object
     */
    turnOffAlgo:  async (_parent, { id }, _context, _info) => { 
      let algo = null
      try {
        algo = await Algo.findOne({_id: id})
      } catch (e) {
        console.log('error finding algo', e)
      }
      
      try {
        const response = await Algo.updateOne({_id: id}, {status: 'off'})
        console.log('response', response)
      } catch (e) {
        console.log('error updating algo by turning it off')
      }
    },
    addAlgo: async (_parent, { data }, _context, _info) => { 
      /**
       * {
          "data": {
            "exchange": "Bitmex",
            "symbol": "XBTUSD",
            "name": "FastEMA"
             "timeFrame": "2H",
            "additionalInfo": [9, 18],
            "status": "off"
            "executedNum": 0
            "maxExecution": 1
          }
        }
       */
      console.log('got data', data)
      try {
        const response = await Algo.create(data)
        console.log('algo created', response)
      } catch (e) {
        console.log('error creating algo', e)
      }
    }
  }
}