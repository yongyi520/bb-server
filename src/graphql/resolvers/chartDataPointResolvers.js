import _ from "lodash";
import ChartDataPoint from "../../db/models/chartDataPointModel";
import CryptoCompare from "../../lib/cryptocompare/CryptoCompare";
import { getStartEMAEpochTime } from "../../lib/dateUtils";
import { calculateSlowAndFastEmaArray } from "../../lib/tradeUtils";
import { calculateBitmexEMADaily } from "../../lib/chartDataPointUtils";

export default {
  Query: {
    getChartDataPoints: async (_parent, { epochTime }, { db, models, ctx }) => {
      return await ChartDataPoint.find();
    },
    epochTimeToDate: async (_parent, { epochTime }, { db, models, ctx }) => {
      console.log("date is", new Date(epochTime * 1000));
      return true;
    }
  },
  Mutation: {
    addChartDataPoint: async (_parent, { data }, { db, models, ctx }) => {
      /**
       {
          "data": {
            "exchange": "Bitmex",
            "symbol": "XBTUSD",
            "type": "EMA",
            "typePeriod": 18,
            "timeFrame": 2,
            "timeFrameUnit": "H",
            "epochTime": 1582675200,
            "value": 9490.6
          }
        } 
      **/
      // make sure the data entry type is manual
      data.dataEntryType = "manual";
      console.log("data", data);
      //  console.log('chart data point', ChartDataPoint)
      // const ChartDataPoint = ChartDataPointModel(dbConn);
      try {
        const response = await ChartDataPoint.create(data);
        console.log("chart data point response", response);
        return response
      } catch (e) {
        console.log("> create chart data point error: ", e);
      }
    },
    updateChartDataPoint: async (_parent, { id, data }, _context) => {
      console.log("update chart data point id", id);
      console.log("update data", data);
      try {
        const findResponse = await ChartDataPoint.findOne({ _id: id });
        if (findResponse) {
          const updateResponse = await ChartDataPoint.updateOne(
            { _id: id },
            data
          );
          if (updateResponse.n === 1) {
            return await ChartDataPoint.findOne({ _id: id });
          }
          return null;
        }
      } catch (e) {
        console.log(
          "something is wrong with the data base, either cannot find chart data point or cannot update"
        );
      }
    },
    deleteChartDataPoint: async (_parent, { id }, _context) => {
      try {
        const deleteResponse = await ChartDataPoint.deleteOne({ _id: id });
        return deleteResponse && deleteResponse.n === 1 ? { id } : null;
      } catch (e) {
        console.log(
          "something is wrong with delete algo, cannot find it or some mongo error"
        );
      }
    },
    calculateBitmexEMADaily: async (_parent, _args, _context) => {
      await calculateBitmexEMADaily();
    }
  }
};
