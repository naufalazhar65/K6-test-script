// POST METHOD

import http from "k6/http";
import { check } from "k6";

export const options = {
    vus: 100,
    duration: '10s',

    thresholds: {
      http_req_duration: ['p(99)<1500'], // 99% of requests must complete below 1.5s
      http_req_failed: ['rate<0.01'], // http errors should be less than 1%
    },
};

export default function () {
  let url = "https://reqres.in/api/login";
  let payload = JSON.stringify({
    email: "eve.holt@reqres.in",
    password: "cityslicka",
  });
  let params = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  let res = http.post(url, payload, params);
  check(res, {
    "status is 200": (r) => r.status === 200,
    "response contains token": (r) => r.json().token !== null,
  });
}

export default function () {
  let url = "https://reqres.in/api/users?page=2";
  let res = http.get(url);
  check(res, {
    "status is 200": (r) => r.status === 200,
    "response contains users": (r) => r.json().data.length > 0,
  });
}


