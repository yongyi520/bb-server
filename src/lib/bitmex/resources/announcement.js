import request from "request-promise-native";
import { getRequestOptions } from "../requestUtils";

var Announcement = function(bitmexClient) {
  this.bitmexClient = bitmexClient;
};

Announcement.prototype.list = async function() {
  console.log('this.bitmexClient', this.bitmexClient)
  let verb = "GET";
  let path = "/api/v1/announcement";
  let data = "";
  const url = this.bitmexClient.test
    ? "https://testnet.bitmex.com" + path
    : "https://www.bitmex.com" + path;
  console.log("url", url);
  const requestOptions = getRequestOptions(
    verb,
    path,
    data,
    url,
    this.bitmexClient.apiKey,
    this.bitmexClient.apiSecret
  );
  try {
    return request(requestOptions);
  } catch (e) {
    console.log("error", e);
  }
};

export default Announcement;
