import _ from "lodash";
import ChartDataPoint from "../../db/models/chartDataPointModel";
import CryptoCompare from "../../lib/cryptocompare/CryptoCompare";
import { getStartEMAEpochTime } from "../../lib/dateUtils";
import { calculateSlowAndFastEmaArray } from "../../lib/tradeUtils";
import { calculateBitmexEMADaily } from "../../lib/chartDataPointUtils";

export default {
  Query: {
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
      } catch (e) {
        console.log("> create chart data point error: ", e);
      }
    },
    calculateBitmexEMADaily: async (_parent, _args, _context) => {
      await calculateBitmexEMADaily()
    }
  }
};
