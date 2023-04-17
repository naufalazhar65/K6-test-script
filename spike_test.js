import http from 'k6/http';
import { sleep, check } from 'k6';

export let options = {
  stages: [
    { duration: '10s', target: 20 }, // naik menjadi 20 VU selama 10 detik
    { duration: '20s', target: 50 }, // naik menjadi 50 VU selama 20 detik
    { duration: '10s', target: 0 }, // turun menjadi 0 VU selama 10 detik
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // ambang batas waktu respon
    http_req_failed: ['rate<0.1'], // ambang batas kegagalan permintaan
  },
};

export default function () {
  // GET Request
  let res1 = http.get('https://reqres.in/api/users?page=2');
  sleep(1);
  check(res1, {
    'status is 200': (r) => r.status === 200,
    'response body is not empty': (r) => r.body.length > 0,
    'has 6 users': (r) => JSON.parse(r.body).data.length === 6,
  });

  // POST Request
  let data = JSON.stringify({
    name: 'Naufal',
    job: 'Software Engineer',
  });

  let params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  let res2 = http.post('https://reqres.in/api/users', data, params);
  sleep(1);
  check(res2, {
    'status is 201': (r) => r.status === 201,
    'response body is not empty': (r) => r.body.length > 0,
  });
}
