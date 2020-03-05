import _ from "lodash";
import ChartDataPoint from "../db/models/chartDataPointModel";

export const EMACalc = (mArray, mRange, startEMA) => {
  var k = 2 / (mRange + 1);
  // first item is just the same as the first item in the input
  let emaArray = [startEMA];
  // for the rest of the items, they are computed with the previous one
  for (var i = 1; i < mArray.length; i++) {
    emaArray.push(mArray[i].close * k + emaArray[i - 1] * (1 - k));
  }
  return emaArray;
};

export const calculateSlowAndFastEmaArray = async (
  dataArray,
  chartDataPointQuery,
  slowEmaPeriod,
  fastEmaPeriod
) => {
  const chartDataPoints = await ChartDataPoint.find(chartDataPointQuery);
  // console.log('chart data point', chartDataPoints)
  if (chartDataPoints.length === 2) {
    const startFastEma = _.find(
      chartDataPoints,
      c => c.typePeriod === slowEmaPeriod
    );
    const startSlowEma = _.find(
      chartDataPoints,
      c => c.typePeriod === fastEmaPeriod
    );
    // console.log('fast ema', startFastEma)
    // console.log('slow ema', startSlowEma)
    const fastEmaArray = EMACalc(dataArray, 9, startFastEma.value);
    const slowEmaArray = EMACalc(dataArray, 18, startSlowEma.value);
    return { slowEmaArray, fastEmaArray };
  }
  console.log('cannot find the ema value for epoch time, so cannot calculate slow and fast ema')
  return { slowEmaArray: null, fastEmaArray: null };
};

export const calculateEntryProfitStopOrders = (
  exchange,
  symbol,
  side,
  quantity,
  entryPrice,
  stopLossPercentage,
  profitPercentage
) => {
  if (entryPrice === null) {
    console.log('entry price is null, means close is not on the same side of ema momentum, no orders')
    return { entryOrder: null, profitOrder: null, stopLossOrder: null };
  }
    
  /**
   * const entryOrder = {
        symbol: "XBTUSD",
        side: "Buy",
        orderQty: 1,
        price: 8000,
        ordType: "Limit"
      };
      const stopLimitOrder = {
        symbol: "XBTUSD",
        side: "Sell",
        orderQty: 1,
        stopPx: 7950,
        price: 7900,
        ordType: "StopLimit",
        execInst: "Close"
      };
      const profitOrder = {
        symbol: "XBTUSD",
        side: "Buy",
        orderQty: 1,
        price: 20000,
        ordType: "Limit",
        execInst: "ReduceOnly"
      };
   */

  const sideMultiplier = side === "Buy" ? 1 : -1;
  const entryOrder = {
    symbol,
    side,
    orderQty: quantity,
    price: roundPrice(exchange, symbol, entryPrice),
    ordType: "Limit"
  };
  const stopPricePx = roundPrice(exchange, symbol, entryPrice * (1 - sideMultiplier * stopLossPercentage));
  const stopPrice = roundPrice(exchange, symbol, stopPricePx - sideMultiplier * 30);
  const stopLossOrder = {
    symbol,
    side: side === "Buy" ? "Sell" : "Buy",
    orderQty: quantity,
    price: stopPrice,
    ordType: "StopLimit",
    stopPx: stopPricePx,
    execInst: "Close"
  };
  const profitPrice = roundPrice(exchange, symbol, entryPrice * (1 + sideMultiplier * profitPercentage))
  const profitOrder = {
    symbol,
    side: side === "Buy" ? "Sell" : "Buy",
    orderQty: quantity,
    price: profitPrice,
    ordType: "Limit",
    execInst: "ReduceOnly"
  };
  return { entryOrder, profitOrder, stopLossOrder };
};

export const roundPrice = (exchange, symbol, price) => {
  if(exchange === 'Bitmex') {
    if (symbol === 'XBTUSD') {
      return Math.round(price)
    }
  }
  return null
}