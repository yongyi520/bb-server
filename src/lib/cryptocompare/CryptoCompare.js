import request from "request-promise-native";
import { getQueryString } from "../requestUtils";

var CryptoCompare = function(key) {
  this.key = key
}

CryptoCompare.prototype.getHourlyData = async function(queries) {
  const base = "https://min-api.cryptocompare.com/data/v2/histohour"
  const queriesString = getQueryString(queries)
  const url = base + queriesString + "&api_key=" + this.key
  // console.log('url', url)
  var qs = {
    ...queries, 
    api_key: this.key
  }
  const options = {
    uri: base,
    qs: qs,
    headers: {
        'User-Agent': 'Request-Promise'
    },
    json: true // Automatically parses the JSON string in the response
};
  try {
    return request(options)
  } catch (e) {
    console.log('error fetching cryptocompare hourly data', e)
  }
}

export default CryptoCompare