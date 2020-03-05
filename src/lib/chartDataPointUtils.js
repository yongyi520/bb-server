import _ from 'lodash'
import CryptoCompare from "./cryptocompare/CryptoCompare";
import { getStartEMAEpochTime } from "./dateUtils";
import { calculateSlowAndFastEmaArray } from './tradeUtils';
import ChartDataPoint from '../db/models/chartDataPointModel';

export const calculateBitmexEMADaily = async () => {
  var cryptocompare = new CryptoCompare(process.env.CRYPTOCOMPAREKEY);
      const queries = {
        fsym: "XBTUSD",
        tsym: "USD",
        limit: 30,
        e: "Bitmex",
        aggregate: 2
      };
      const response = await cryptocompare.getHourlyData(queries);
      const data = response.Data.Data;
      // console.log('bi hourly data', data)
      // get timeTo epoch time to date
      const startEpochTime = getStartEMAEpochTime(response.Data.TimeTo);
      console.log("start epoch time", startEpochTime);
      // get data starting from the startEpochTime
      const startIndex = _.findIndex(data, d => d.time === startEpochTime);
      // console.log("start index", startIndex);
      const dataArray = _.slice(data, startIndex, startIndex + 13);
      // console.log("data Array", dataArray);
      const slowEmaPeriod = 9;
      const fastEmaPeriod = 18;
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
        chartDataPointQuery,
        slowEmaPeriod,
        fastEmaPeriod
      );
      const slowEma = slowEmaArray[slowEmaArray.length - 1];
      const fastEma = fastEmaArray[fastEmaArray.length - 1];
      const endEpochTime = dataArray[dataArray.length - 1].time
      console.log('slow ema', slowEma)
      console.log('fast ema', fastEma)
      console.log('end epoch time', endEpochTime)
      console.log('calculated end epoch time', startEpochTime + 86400)
      const slowEmaChartDataPointEntry = {
        exchange: "Bitmex",
        symbol: "XBTUSD",
        type: "EMA",
        typePeriod: 18,
        timeFrame: 2,
        timeFrameUnit: "H",
        epochTime: endEpochTime,
        value: slowEma,
        dataEntryType: 'calculated'
      }
      const fastEmaChartDataPointEntry = {
        exchange: "Bitmex",
        symbol: "XBTUSD",
        type: "EMA",
        typePeriod: 9,
        timeFrame: 2,
        timeFrameUnit: "H",
        epochTime: endEpochTime,
        value: fastEma,
        dataEntryType: 'calculated'
      }
      console.log('adding fast ema to chart data point db')
      await ChartDataPoint.create(fastEmaChartDataPointEntry)
      console.log('adding slow ema to chart data point db')
      await ChartDataPoint.create(slowEmaChartDataPointEntry)
}