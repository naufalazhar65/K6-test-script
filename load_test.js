import http from "k6/http";
import { check, sleep } from "k6";

export let options = {
  vus: 10, // jumlah virtual user
  duration: "30s", // durasi pengujian
  thresholds: {
    http_req_duration: ["p(95)<500"], // ambang batas waktu respon
    http_req_failed: ["rate<0.1"], // ambang batas kegagalan permintaan
  },
};

export default function () {
  // GET /api/users?page=1
  let res1 = http.get("https://reqres.in/api/users?page=1");

  // Verifikasi hasil permintaan GET
  check(res1, {
    "status is 200": (r) => r.status === 200,
    "response time is less than 1s": (r) => r.timings.duration < 1000,
    "has 6 users": (r) => JSON.parse(r.body).data.length === 6,
  });

  // POST /api/users with JSON data
  let data = JSON.stringify({
    name: "Naufal",
    job: "Software Engineer",
  });
  let res2 = http.post("https://reqres.in/api/users", data, {
    headers: { "Content-Type": "application/json" },
  });

  // Verifikasi hasil permintaan POST
  check(res2, {
    "status is 201": (r) => r.status === 201,
    "response time is less than 1s": (r) => r.timings.duration < 1000,
    "has ID and createdAt properties": (r) =>
      JSON.parse(r.body).hasOwnProperty("id") &&
      JSON.parse(r.body).hasOwnProperty("createdAt"),
  });

  // Beri jeda 1 detik sebelum mengulang permintaan
  sleep(1);
}
