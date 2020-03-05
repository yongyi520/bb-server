"use strict";
import request from "request-promise-native";
import { getExpires, getSignature, getHeaders, getRequestOptions } from "./requestUtils";
import { registerAll } from "./resources";

var BitmexClient = function (apiKey, apiSecret, test) {
  this.apiKey = apiKey;
  this.apiSecret = apiSecret;
  this.test = test;
};

registerAll(BitmexClient)

export default BitmexClient

// export const bitmexClient = async (apiKey, apiSecret, test) => {
//   let verb = "GET";
//   let path = "/api/v1/announcement";
//   let expires = Math.round(new Date().getTime() / 1000) + 60; // 1 min in the future
//   let data = ''
//   // let data = { symbol: "XBTUSD", orderQty: 1, price: 590, ordType: "Limit" };

//   // Pre-compute the postBody so we can be sure that we're using *exactly* the same body in the request
//   // and in the signature. If you don't do this, you might get differently-sorted keys and blow the signature.
//   let postBody = JSON.stringify(data);
//   console.log('postBody', postBody)
//   let signature = crypto
//     .createHmac("sha256", apiSecret)
//     .update(verb + path + expires + data)
//     .digest("hex");

//   let headers = {
//     "content-type": "application/json",
//     Accept: "application/json",
//     "X-Requested-With": "XMLHttpRequest",
//     // This example uses the 'expires' scheme. You can also use the 'nonce' scheme. See
//     // https://www.bitmex.com/app/apiKeysUsage for more details.
//     "api-expires": expires,
//     "api-key": apiKey,
//     "api-signature": signature
//   };

//   const url = test
//     ? "https://testnet.bitmex.com" + path
//     : "https://www.bitmex.com" + path;
//     console.log('url', url)
//   const requestOptions = {
//     headers: headers,
//     url: url,
//     method: verb,
//     body: data
//   };

//   try {
//     console.log('calling request')
//     const response = await request(requestOptions);
//     console.log("response", response);
//   } catch (e) {
//     console.log("error", e);
//   }
//   // request(requestOptions, function(error, response, body) {
//   //   if (error) {
//   //     console.log(error);
//   //   }
//   //   console.log(body);
//   // });
// };

// export const testSignature = async () => {
//   let verb = "POST"
//   let path = '/api/v1/order'
//   let expires = 1518064238
//   let data = '{"symbol":"XBTM15","price":219.0,"clOrdID":"mm_bitmex_1a/oemUeQ4CAJZgP3fjHsA","orderQty":98}'
//   let apiKey = 'LAqUlngMIQkIUjXMUreyu3qn'
//   let apiSecret = 'chNOOS4KvNXR_Xq4k4c9qsfoKWvnDecLATCRlcBwyKDYnWgO'

//   let postBody = JSON.stringify(data);

//   console.log('data', data)
//   console.log('postBody', postBody)
//   let signature = crypto
//     .createHmac("sha256", apiSecret)
//     .update(verb + path + expires + data)
//     .digest("hex");

//     console.log('signature', signature)
//     const compare = '1749cd2ccae4aa49048ae09f0b95110cee706e0944e6a14ad0b3a8cb45bd336b'
//     console.log('compare', compare)
//     console.log('real signature compare', compare === signature)
// }
