import http from 'k6/http';
import { sleep, check } from 'k6';

export let options = {
  stages: [
    { duration: '1m', target: 50 }, // Naikkan beban dari 0 ke 50 VU dalam waktu 1 menit
    { duration: '2m', target: 50 }, // Pertahankan 50 VU selama 2 menit
    { duration: '1m', target: 0 }, // Turunkan beban dari 50 ke 0 VU dalam waktu 1 menit
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // ambang batas waktu respon
    http_req_failed: ['rate<0.1'], // ambang batas kegagalan permintaan
  },
};

export default function () {
  // GET Request
  let res1 = http.get('https://reqres.in/api/users?page=2');

  check(res1, {
    'status is 200': (r) => r.status === 200,
    'has 6 users': (r) => JSON.parse(r.body).data.length === 6,
  });

  sleep(1);

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

  check(res2, {
    'status is 201': (r) => r.status === 201,
    'has ID and createdAt properties': (r) =>
      JSON.parse(r.body).hasOwnProperty('id') &&
      JSON.parse(r.body).hasOwnProperty('createdAt'),
  });

  sleep(1);
}
