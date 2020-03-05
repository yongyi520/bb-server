import BitmexClient from "../../lib/bitmex/BitmexClient";

export default {
  Query: {
    bitmexUserGetWallet(_parent, _args, _context, _info) {},
    bitmexAccouncement: async (_parent, _args, _context, _info) => {
      const mexId = process.env.MEXID;
      const mexSecret = process.env.MEXSECRET;
      console.log("mexSecret", mexSecret);
      console.log("BITMEXCLIENT", typeof BitmexClient);
      var bitmexClient = new BitmexClient(mexId, mexSecret, true);
      // console.log('announcement', typeof Announcement)
      // console.log('bitmex client', bitmexClient)
      const announcement = await bitmexClient.announcement.list();
      console.log("announcement", announcement);
    },
    bitmexOrders: async (_parent, _args, _context, _info) => {
      const mexId = process.env.MEXID;
      const mexSecret = process.env.MEXSECRET;
      console.log("mexSecret", mexSecret);
      var bitmexClient = new BitmexClient(mexId, mexSecret, true);
      // reverse: true to make it the latest
      // use filter: {key:value} for specific fields like order-id and stuff
      const XBTPerpetualOpenOrders = {
        symbol: "XBT:perpetual",
        count: 10,
        reverse: true,
        filter: { open: true }
      };
      const orders = await bitmexClient.order.list(XBTPerpetualOpenOrders);
      console.log("orders", orders);
    },
    bitmexPositions: async (_parent, _args, _context, _info) => {
      var bitmexClient = new BitmexClient(
        process.env.MEXID,
        process.env.MEXSECRET,
        true
      );
      const XBTUSDQuery = {
        symbol: "XBTUSD"
      };
      const positions = await bitmexClient.position.list(XBTUSDQuery);
      console.log("positions", positions);
    },
  },
  Mutation: {
    bitmexAddOrder: async (_parent, _args, _context, _info) => {
      var bitmexClient = new BitmexClient(
        process.env.MEXID,
        process.env.MEXSECRET,
        true
      );
      const entryOrder = {
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
      const entryOrderResponse = await bitmexClient.order.new(entryOrder);
      console.log("entryOrderResponse", entryOrderResponse);
      const stopOrderResponse = await bitmexClient.order.new(stopLimitOrder);
      console.log("stopOrderResponse", stopOrderResponse);
      // const profitOrderResponse = await bitmexClient.order.new(profitOrder)
      // console.log('profitOrderResponse', profitOrderResponse)
    },
    bitmexUpdateOrder: async (_parent, _args, _context, _info) => {
      var bitmexClient = new BitmexClient(
        process.env.MEXID,
        process.env.MEXSECRET,
        true
      );
      const updateEntryOrder = {
        orderID: "a83a753a-e875-0de0-9c58-4e56227961c4",
        orderQty: 5,
        price: 8500
      };
      const updateStopOrder = {
        orderID: "886e6f59-9bea-9f22-cbd0-aad5df014156",
        stopPx: 7960,
        price: 7910
      };
      // const updateEntryResponse = await bitmexClient.order.update(updateEntryOrder)
      // console.log('update entry response', updateEntryResponse)
      // const updateStopResponse = await bitmexClient.order.update(updateStopOrder)
      // console.log('update stop response', updateStopResponse)
    },
    bitmexDeleteOrder: async (_parent, _args, _context, _info) => {
      var bitmexClient = new BitmexClient(
        process.env.MEXID,
        process.env.MEXSECRET,
        true
      );
      const deleteOrderIDs = {
        orderID: [
          "b62c67ce-73fa-44ad-37c2-52c5f9ff5f70",
          "92e78e3b-ac58-1f8c-5afd-4f0a7ae072f9"
        ]
      };
      const deleteResponse = await bitmexClient.order.delete(deleteOrderIDs);
      console.log("delete response", deleteResponse);
    },
    bitmexAddBulkOrders: async (_parent, _args, _context, _info) => {
      var bitmexClient = new BitmexClient(
        process.env.MEXID,
        process.env.MEXSECRET,
        true
      );
      const entryOrder = {
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
      const newBulkArray = { orders: [entryOrder, stopLimitOrder] };
      console.log("bulk order params", newBulkArray);
      const newBulkResponse = await bitmexClient.order.newBulk(newBulkArray);
      console.log("newBulkResponse", newBulkResponse);
    },
    bitmexUpdateBulkOrders: async (_parent, _args, _context, _info) => {
      var bitmexClient = new BitmexClient(
        process.env.MEXID,
        process.env.MEXSECRET,
        true
      );
      const entryOrder = {
        orderID: "f39f2347-0ca8-0b1f-aef7-a4138728c75f",
        symbol: "XBTUSD",
        side: "Buy",
        orderQty: 1,
        price: 8100,
        ordType: "Limit"
      };
      const stopLimitOrder = {
        orderID: "37d8b343-51a6-72aa-b25a-f22e4e3168c1",
        symbol: "XBTUSD",
        side: "Sell",
        orderQty: 1,
        stopPx: 8000,
        price: 7999,
        ordType: "StopLimit",
        execInst: "Close"
      };
      const updateBulkArray = { orders: [entryOrder, stopLimitOrder] };
      console.log("bulk order params", updateBulkArray);
      const updateBulkResponse = await bitmexClient.order.updateBulk(
        updateBulkArray
      );
      console.log("updateBulkResponse", updateBulkResponse);
    }
  }
}