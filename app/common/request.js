"use strict";

import queryString from "query-string";
import _ from "lodash";
import Mock from "mockjs";
import config from "./config";
let request = {};

request.get = function(url, params) {
  if (params) {
    url += "?" + queryString.stringify(params);
  }

  return fetch(url)
    .then(response => response.json())
    .then(responseJson => Mock.mock(responseJson)); // 将来到了线上环境，将此行注释掉即可
};

request.post = function(url, body) {
  var options = _.extend(config.header, {
    body: JSON.stringify(body)
  });

  return fetch(url, options)
    .then(response => response.json())
    .then(responseJson => Mock.mock(responseJson));
};

// export { request };
module.exports = request;
