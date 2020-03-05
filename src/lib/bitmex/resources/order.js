import request from "request-promise-native";
import { getRequestOptions } from "../requestUtils";
import { buildEncodedQueryString } from "../../requestUtils";

var Order = function(bitmexClient) {
  this.bitmexClient = bitmexClient;
};

Order.prototype.list = async function(params) {
  let verb = "GET";
  let path = "/api/v1/order" + buildEncodedQueryString(params);
  let data = "";
  const url = this.bitmexClient.test
    ? "https://testnet.bitmex.com" + path
    : "https://www.bitmex.com" + path;
  const requestOptions = getRequestOptions(
    verb,
    path,
    data,
    url,
    this.bitmexClient.apiKey,
    this.bitmexClient.apiSecret
  );
  // console.log("request options", requestOptions);
  try {
    return JSON.parse(await request(requestOptions));
  } catch (e) {
    console.log("error", e);
  }
};

Order.prototype.new = async function(params) {
  let verb = "POST";
  let path = "/api/v1/order";
  let data = JSON.stringify(params);
  const url = this.bitmexClient.test
    ? "https://testnet.bitmex.com" + path
    : "https://www.bitmex.com" + path;
  const requestOptions = getRequestOptions(
    verb,
    path,
    data,
    url,
    this.bitmexClient.apiKey,
    this.bitmexClient.apiSecret
  );
  // console.log("request options", requestOptions);
  try {
    return JSON.parse(await request(requestOptions));
  } catch (e) {
    console.log("error", e);
  }
};

Order.prototype.delete = async function(params) {
  let verb = "DELETE";
  let path = "/api/v1/order";
  let data = JSON.stringify(params);
  const url = this.bitmexClient.test
    ? "https://testnet.bitmex.com" + path
    : "https://www.bitmex.com" + path;
  const requestOptions = getRequestOptions(
    verb,
    path,
    data,
    url,
    this.bitmexClient.apiKey,
    this.bitmexClient.apiSecret
  );
  // console.log("request options", requestOptions);
  return request(requestOptions);

};

Order.prototype.update = async function(params) {
  let verb = "PUT";
  let path = "/api/v1/order";
  let data = JSON.stringify(params);
  const url = this.bitmexClient.test
    ? "https://testnet.bitmex.com" + path
    : "https://www.bitmex.com" + path;
  const requestOptions = getRequestOptions(
    verb,
    path,
    data,
    url,
    this.bitmexClient.apiKey,
    this.bitmexClient.apiSecret
  );
  // console.log("request options", requestOptions);
  try {
    return JSON.parse(await request(requestOptions));
  } catch (e) {
    console.log("error", e);
  }
};

Order.prototype.newBulk = async function(params) {
  let verb = "POST";
  let path = "/api/v1/order/bulk";
  let data = JSON.stringify(params);
  const url = this.bitmexClient.test
    ? "https://testnet.bitmex.com" + path
    : "https://www.bitmex.com" + path;
  const requestOptions = getRequestOptions(
    verb,
    path,
    data,
    url,
    this.bitmexClient.apiKey,
    this.bitmexClient.apiSecret
  );
  // console.log("request options", requestOptions);
  try {
    return JSON.parse(await request(requestOptions));
  } catch (e) {
    console.log("error", e);
  }
};

Order.prototype.updateBulk = async function(params) {
  let verb = "PUT";
  let path = "/api/v1/order/bulk";
  let data = JSON.stringify(params);
  const url = this.bitmexClient.test
    ? "https://testnet.bitmex.com" + path
    : "https://www.bitmex.com" + path;
  const requestOptions = getRequestOptions(
    verb,
    path,
    data,
    url,
    this.bitmexClient.apiKey,
    this.bitmexClient.apiSecret
  );
  // console.log("request options", requestOptions);
  try {
    return JSON.parse(await request(requestOptions));
  } catch (e) {
    console.log("error", e);
  }
};

export default Order;
