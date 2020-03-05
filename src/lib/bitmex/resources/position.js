import request from "request-promise-native";
import { getRequestOptions } from "../requestUtils";
import { buildEncodedQueryString } from "../../requestUtils";

var Position = function(bitmexClient) {
  this.bitmexClient = bitmexClient;
}

Position.prototype.list = async function(params) {
  let verb = "GET";
  let path = "/api/v1/position" + buildEncodedQueryString(params);
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
  console.log("request options", requestOptions);
  try {
    return request(requestOptions);
  } catch (e) {
    console.log("error", e);
  } 
}

export default Position