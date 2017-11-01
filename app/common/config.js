"use strict";

// let configs = {
//   header: {
//     method: "POST",
//     headers: {
//       Accept: "application/json",
//       "Content-Type": "application/json"
//     }
//   },
//   api: {
//     base: "http://rapapi.org/mockjs/27018/",
//     creation: "api/creations"
//   }
// };

// export { configs };

module.exports = {
  header: {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  },
  api: {
    base: "http://rapapi.org/mockjs/27018/",
    creation: "api/creations",
    up: "api/up",
    comment: "api/comments",
    signup: "api/u/signup",
    verify: "api/u/verify"
  }
};
