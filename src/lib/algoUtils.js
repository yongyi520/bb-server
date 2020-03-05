import _ from "lodash";
import { getStartEMAEpochTime } from "./dateUtils";
import {
  calculateSlowAndFastEmaArray,
  calculateEntryProfitStopOrders,
  roundPrice
} from "./tradeUtils";
import CryptoCompare from "./cryptocompare/CryptoCompare";
import BitmexClient from "./bitmex/BitmexClient";
import Order from "../db/models/orderModel";

export const algoIncrementExecutedNum = async algoId => {};

export const addCalculatedEMAToChartDataPoints = async algoId => {};

export const calculateEmaAlgoOrders = async algo => {
  const { exchange, symbol, timeFrame, timeFrameUnit, additionalInfo } = algo;
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
  const dataArray = _.slice(data, startIndex, data.length - 1);

  const chartDataPointQuery = {
    exchange: exchange,
    symbol: symbol,
    timeFrame: timeFrame,
    timeFrameUnit: timeFrameUnit,
    type: "EMA",
    epochTime: startEpochTime
  };
  const [
    slowEmaPeriod,
    fastEmaPeriod,
    stopLossPercentage,
    profitPercentage
  ] = additionalInfo;
  const { slowEmaArray, fastEmaArray } = await calculateSlowAndFastEmaArray(
    dataArray,
    chartDataPointQuery,
    slowEmaPeriod,
    fastEmaPeriod
  );
  if (slowEmaArray === null && fastEmaArray === null) return null;
  const lastClose = dataArray[dataArray.length - 1].close;
  const slowEma = slowEmaArray[slowEmaArray.length - 1];
  const fastEma = fastEmaArray[fastEmaArray.length - 1];
  // test values
  // const lastClose = 9887.5
  // const slowEma = 9821.4
  // const fastEma = 9871.3

  // console.log('slow ema array', slowEmaArray)
  // console.log('fast ema array', fastEmaArray)
  console.log("last slow ema", slowEma);
  console.log("last fast ema", fastEma);
  console.log("last close", lastClose);
  // return {entryOrder: null, stopLossOrder: null, profitOrder: null}
  // TODO: have option within algo or parse the title of the algo to choose entry point to be slow or fast ema

  const side = fastEma > slowEma ? "Buy" : "Sell";
  const entryPrice =
    (side === "Buy" && lastClose > fastEma) ||
    (side === "Sell" && lastClose < fastEma)
      ? fastEma
      : null;
  // const quantity = 6000
  const quantity = 1; // test
  return calculateEntryProfitStopOrders(
    exchange,
    symbol,
    side,
    quantity,
    entryPrice,
    stopLossPercentage,
    profitPercentage
  );
};

export const checkAlgoOrdersStatus = async algo => {
  if (!algo.entryOrder && !algo.profitOrder && !algo.stopLossOrder) {
    return { entry: null, profit: null, stopLoss: null };
  }
  const [orderIds, orderIdsWithKey] = await getMongoEntryProfitStopLossOrderIds(
    algo
  );
  const bitmexAlgoOrdersResponse = await getBitmexOrders(orderIds);
  const parsedBitmexAlgoOrders = await parseBitmexAlgoOrders(
    bitmexAlgoOrdersResponse,
    orderIdsWithKey
  );
  return {
    entry: parsedBitmexAlgoOrders.entryOrder ? parsedBitmexAlgoOrders.entryOrder.status : null,
    profit: parsedBitmexAlgoOrders.profitOrder ? parsedBitmexAlgoOrders.profitOrder.status : null,
    stopLoss: parsedBitmexAlgoOrders.stopLossOrder ? parsedBitmexAlgoOrders.stopLossOrder.status : null
  };
};

export const algoPlaceBitmexOrder = async order => {
  console.log("place single bitmex order");
  var bitmexClient = new BitmexClient(
    process.env.MEXID,
    process.env.MEXSECRET,
    true 
  );
  try {
    return parseBitmexOrderResponse(await bitmexClient.order.new(order));
  } catch (e) {
    console.log("error placing bitmex order", e);
  }
  return null;
};

export const algoPlaceBitmexOrders = async orders => {
  console.log("place bitmex orders");
  var bitmexClient = new BitmexClient(
    process.env.MEXID,
    process.env.MEXSECRET,
    true
  );
  const newBulkArray = { orders };
  const placeBitmexOrdersResponse = await bitmexClient.order.newBulk(
    newBulkArray
  );
  console.log("algo place bitmex orders response", placeBitmexOrdersResponse);
};

export const executeAlgoOrders = algoId => {};

export const parseBitmexOrderResponse = (response, withStatus) => {
  const {
    orderID,
    symbol,
    side,
    orderQty,
    price,
    stopPx,
    ordType,
    execInst,
    ordStatus
  } = response;
  const parsedResponse = {
    exchange: "Bitmex",
    symbol,
    orderId: orderID,
    side,
    price,
    quantity: orderQty,
    stopPrice: stopPx,
    type: ordType
  };
  if (withStatus) parsedResponse.status = ordStatus;
  return parsedResponse;
};

export const cleanBitmexAlgoOrders = async (algo) => {
  const [orderIds, orderIdsWithKey] = await getMongoEntryProfitStopLossOrderIds(
    algo
  );
  var bitmexClient = new BitmexClient(
    process.env.MEXID,
    process.env.MEXSECRET,
    true
  );
  const deleteOrderIDs = {
    orderID: orderIds
  };
  console.log('deleteOrderIDs', deleteOrderIDs)
  try {
    const deleteBitmexResponse = await bitmexClient.order.delete(deleteOrderIDs);
    const deleteMongoResponse = await Order.deleteMany({_id: {$in: [algo.entryOrder, algo.profitOrder, algo.stopLossOrder]}})
    return true
  } catch (e) {
    const body = JSON.parse(e.response && e.response.body)
    if(body.error && body.error.message === 'Not Found') {
      console.log('not orders found in exchange')
      return true
    } 
    console.log('clean algo orders delete orders from bitmex exchange error')
    console.log(body)
  }
  return false
}

const parseBitmexAlgoOrders = (bitmexAlgoOrdersResponse, orderIdsWithKey) => {
  const { entryOrderId, profitOrderId, stopLossOrderId } = orderIdsWithKey;
  // console.log("orderIds with keys", orderIdsWithKey);
  let parsedResponses = {};
  const includeStatus = true;
  _.forEach(bitmexAlgoOrdersResponse, r => {
    const response = parseBitmexOrderResponse(r, includeStatus);
    if (response.orderId === entryOrderId) {
      parsedResponses.entryOrder = response;
    } else if (response.orderId === stopLossOrderId) {
      parsedResponses.stopLossOrder = response;
    } else if (response.orderId === profitOrderId) {
      parsedResponses.profitOrder = response;
    }
  });
  // console.log("parsedResponses", parsedResponses)
  return parsedResponses;
};

export const parseMongoOrderToBitmexOrder = (order, entryStopOrProfit) => {
  console.log('profit order to parse', order)
  const { exchange, symbol, side, price, quantity, type} = order
  let bitmexOrder = {
    symbol,
    side,
    price,
    orderQty: quantity
  }
  /**
   * { _id: 5e5f692422a37a07081798aa,
    exchange: 'Bitmex',
    symbol: 'XBTUSD',
    side: 'Sell',
    price: 8883,
    quantity: 1,
    type: 'Limit',
    __v: 0 }
   */
  if(entryStopOrProfit === 'profit') {
    bitmexOrder.ordType = 'Limit'
    bitmexOrder.execInst = 'ReduceOnly'
    return bitmexOrder
  }
  return null
}

const getMongoEntryProfitStopLossOrderIds = async algo => {
  const orders = await Order.find({
    _id: { $in: [algo.entryOrder, algo.stopLossOrder, algo.profitOrder] }
  });
  const entryOrder = algo.entryOrder
    ? _.find(orders, o => o._id.equals(algo.entryOrder))
    : null;
  const stopLossOrder = algo.stopLossOrder
    ? _.find(orders, o => o._id.equals(algo.stopLossOrder))
    : null;
  const profitOrder = algo.profitOrder
    ? _.find(orders, o => o._id.equals(algo.profitOrder))
    : null;

  const entryProfitStopLossOrders = { entryOrder, profitOrder, stopLossOrder };
  let orderIds = [];
  let orderIdsWithKey = {};
  for (var key in entryProfitStopLossOrders) {
    if (entryProfitStopLossOrders[key] && entryProfitStopLossOrders[key].orderId) {
      orderIds.push(entryProfitStopLossOrders[key].orderId);
      const keyId = key + "Id";
      orderIdsWithKey[keyId] = entryProfitStopLossOrders[key].orderId;
    }
  }
  return [orderIds, orderIdsWithKey];
};

const getBitmexOrders = async orderIds => {
  var bitmexClient = new BitmexClient(
    process.env.MEXID,
    process.env.MEXSECRET,
    true
  );
  return await bitmexClient.order.list({ orderID: orderIds });
};
