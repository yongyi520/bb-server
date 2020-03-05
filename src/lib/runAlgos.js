import Algo from "../db/models/algoModel";
import Order from "../db/models/orderModel";
import {
  checkAlgoOrdersStatus,
  calculateEmaAlgoOrders,
  algoPlaceOrder,
  algoPlaceBitmexOrders,
  algoPlaceBitmexOrder,
  parseBitmexOrderResponse,
  parseMongoOrderToBitmexOrder,
  cleanBitmexAlgoOrders
} from "./algoUtils";
import mongoose from "mongoose";

// officially runs every 2 hours
export const runBitmexFastEMAAlgo = async algoId => {
  console.log("running fast EMA algo");
  console.log('run ema algo update first before anything')
  await runBitmexFastEMAAlgoUpdate(algoId)
  console.log('algo update complete')
  console.log('---- continue ----')
  try {
    const algo = await Algo.findOne({ _id: algoId });
    console.log("algo", algo);
    if (algo) {
      const {
        additionalInfo,
        status,
        profitOrder,
        entryOrder,
        stopLossOrder,
        executedNum,
        maxExecution
      } = algo;
      if (status === "off" || executedNum >= maxExecution) {
        console.log("status is off or max execution has reached");
        return true;
      }
      const algoOrdersStatus = await checkAlgoOrdersStatus(algo);
      console.log("algo order status", algoOrdersStatus);
      // if algoOrders are null
      if (
        (algoOrdersStatus.entry === null &&
          algoOrdersStatus.profit === null &&
          algoOrdersStatus.stopLoss === null) ||
        algoOrdersStatus.entry === "New"
      ) {
        if(algoOrdersStatus.entry === "New"){
          console.log('Entry order not filled, delete previous algo orders from exchange')
          const bitmexOrdersDeleted = await cleanBitmexAlgoOrders(algo);
          console.log("bitmex order deleted ?", bitmexOrdersDeleted);
        } else {
          console.log('No pre-existing orders calculated')
        }
        console.log("calculating orders");
        const algoOrders = await calculateEmaAlgoOrders(algo);
        console.log("algo orders", algoOrders);
        const { entryOrder, profitOrder, stopLossOrder } = algoOrders;
        // const entryOrderResponse = await algoPlaceOrder(entryOrder, 'entry')
        // const stopLossOrderResponse = await algoPlaceOrder(stopLossOrder, 'stopLoss')
        if (
          entryOrder === null &&
          profitOrder === null &&
          stopLossOrder === null
        )
          return true; // no orders are calculated so stop now
        // console.log("profit order", profitOrder);
        // console.log("entry order", entryOrder);
        // console.log("stoploss order", stopLossOrder);
        const parsedEntryOrder = await algoPlaceBitmexOrder(entryOrder); // null if error
        const parsedStopLossOrder = await algoPlaceBitmexOrder(stopLossOrder); // null if error
        const parsedProfitOrder = parseBitmexOrderResponse(profitOrder);
        console.log("entry order response", parsedEntryOrder);
        console.log("stop loss order response", parsedStopLossOrder);
        console.log("parsed profit order", parsedProfitOrder);
        // update Order mongoDB for entry, profit, and stopLoss orders (entry and profit should have orderID)
        const entryOrderMongoDB = await Order.create(parsedEntryOrder);
        const stopLossOrderMongoDB = await Order.create(parsedStopLossOrder);
        const profitOrderMongoDB = await Order.create(parsedProfitOrder); // add profit order without placing bitmex order, update the id later
        console.log("entryOrerMongoDB", entryOrderMongoDB);
        console.log("stopLossOrderMongoDB", stopLossOrderMongoDB);
        console.log("profitOrderMongoDB", profitOrderMongoDB);
        // update algo's status, entryOrder, stopLossOrder, and profitOrder
        const algoUpdateDocuments = {
          entryOrder: entryOrderMongoDB._id,
          stopLossOrder: stopLossOrderMongoDB._id,
          profitOrder: profitOrderMongoDB._id,
          status: "waiting"
        };
        const algoUpdateResponse = await Algo.updateOne(
          { _id: algoId },
          algoUpdateDocuments
        );
        console.log("algo update status to waiting");
        return true;
      }
      return true;
    }
  } catch (e) {
    console.log("error finding algo", e);
  }
};

// this is to run algo for updates, like not every 2 hours type
export const runBitmexFastEMAAlgoUpdate = async algoId => {
  console.log("run bitmex algo update");
  try {
    const algo = await Algo.findOne({ _id: algoId });
    // console.log("algo", algo);
    if (algo) {
      const { status } = algo;
      if (status === "off") return true;
      const algoOrdersStatus = await checkAlgoOrdersStatus(algo);
      console.log("algo order status", algoOrdersStatus);
      const { entry, stopLoss, profit } = algoOrdersStatus;
      if (entry === "New") {
        console.log("entry order not filled, do nothing");
      } else if (entry === "Filled" && stopLoss === "New" && profit === null) {
        console.log("entry order filled, creating profit order");
        const profitOrder = await Order.findOne({
          _id: { $in: [algo.profitOrder] }
        });
        const bitmexProfitOrder = parseMongoOrderToBitmexOrder(
          profitOrder,
          "profit"
        );
        const bitmexProfitOrderResponse = await algoPlaceBitmexOrder(
          bitmexProfitOrder
        );
        const profitOrderMongoUpdateResponse = await Order.updateOne(
          { _id: algo.profitOrder },
          { orderId: bitmexProfitOrderResponse.orderId }
        );
        console.log("bitmex order response", bitmexProfitOrderResponse);
        console.log(
          "profit order mongo response",
          profitOrderMongoUpdateResponse
        );
      } else if (
        (entry === "Filled" && profit === "Filled") ||
        (entry === "Filled" && stopLoss === "Filled")
      ) {
        const profitOrStopLoss = profit === "Filled" ? "profit" : "stop loss";
        console.log(
          `entry order filled, ${profitOrStopLoss} filled, execution over`
        );
        // algo order clean up
        const bitmexOrdersDeleted = await cleanBitmexAlgoOrders(algo);
        console.log("bitmex order deleted ?", bitmexOrdersDeleted);
        if (bitmexOrdersDeleted) {
          // update the algo database
          console.log("update algo database");
          const response = await Algo.updateOne(
            { _id: algoId },
            {
              entryOrder: null,
              stopLossOrder: null,
              profitOrder: null,
              executedNum: algo.executedNum + 1,
              status: algo.executedNum + 1 >= algo.maxExecution ? "off" : "on"
            }
          );
          const updated = response.n === 1;
          console.log("algo update response?", updated);
        }
      } else {
        console.log("else");
      }
    }
  } catch (e) {
    console.log("run bitmex algo update error", e);
  }
};
