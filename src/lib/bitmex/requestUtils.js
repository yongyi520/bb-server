import crypto from "crypto";

export const getSignature = (secret, verb, path, expires, data) => {
  // console.log("secret", secret);
  return crypto
    .createHmac("sha256", secret)
    .update(verb + path + expires + data)
    .digest("hex");
};

export const getExpires = () => {
  return Math.round(new Date().getTime() / 1000) + 60; // 1 min in the future
};

export const getHeaders = (expires, apiKey, signature) => {
  return {
    "content-type": "application/json",
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
    // This example uses the 'expires' scheme. You can also use the 'nonce' scheme. See
    // https://www.bitmex.com/app/apiKeysUsage for more details.
    "api-expires": expires,
    "api-key": apiKey,
    "api-signature": signature
  };
};

export const getRequestOptions = (verb, path, data, url, apiKey, apiSecret) => {
  let expires = getExpires();
  let signature = getSignature(apiSecret, verb, path, expires, data);
  let headers = getHeaders(expires, apiKey, signature);
  return {
    headers: headers,
    url: url,
    method: verb,
    body: data
  };
};
