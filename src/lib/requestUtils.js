export const buildEncodedQueryString = queries => {
  return encodeURI(getQueryString(queries));
};

export const getQueryString = queries => {
  if (queries !== null) {
    let queryString = "?";
    for (var key of Object.keys(queries)) {
      // console.log("key is filter", key === "filter");
      const value =
        key === "filter" ? JSON.stringify(queries[key]) : queries[key];
      queryString =
        queryString[queryString.length - 1] === "?"
          ? queryString + key + "=" + value
          : queryString + "&" + key + "=" + value;
      // console.log("query string", queryString);
    }
    return queryString;
  } else {
    return "";
  }
};
