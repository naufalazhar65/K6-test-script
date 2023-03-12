import http from 'k6/http';
import { check, sleep } from 'k6';

// LOAD_TEST
export const options = {
    stages: [
      { duration: '5m', target: 100 }, // simulate ramp-up of traffic from 1 to 100 users over 5 minutes.
      { duration: '10m', target: 100 }, // stay at 100 users for 10 minutes
      { duration: '5m', target: 0 }, // ramp-down to 0 users
    ],
    thresholds: {
      http_req_duration: ['p(99)<1500'], // 99% of requests must complete below 1.5s
      http_req_failed: ['rate<0.01'], // http errors should be less than 1%
    },
};

export default function () {
    // const urlGet = 'https://reqres.in/api/users/2';
    // const urlDelete = 'https://reqres.in/api/users/2';
    
    // const urlPut = 'https://reqres.in/api/users/2';
    // const payloadPut = JSON.stringify({
    //     name: 'morpheus',
    //     job: 'zion resident',
    // })

    const urlPost = 'https://reqres.in/api/users';
    const payload = JSON.stringify({
        name: 'morpheus',
        job: 'leader',
    })

    const params = {
        Headers:{
            'Content-Type' : 'application/json',
        },
    };
    // const get = http.get(urlGet, params);
    // check(get, {
    //     'it status 200': (r) => r.status === 200,
    //     'is res body has id': (r) => r.body.includes('id'),
    // });

    // const put= http.put(urlPut, payloadPut, params);
    // check(put, {
    //     'Edited and it status 200': (r) => r.status === 200,
    //     'is res body has job': (r) => r.body.includes(""),
    // });

    const post = http.post(urlPost, payload, params);
    check(post, {
        'Register Succesfully and it status 201': (r) => r.status === 201,
        'is res body has id': (r) => r.body.includes('id'),
    });
    
    // const del = http.del(urlDelete, params);
    // check(del, {
    //     'Delete Succesfully and it status 204': (r) => r.status === 204,
        // 'is res body has empty': (r) => r.body.includes(NULL),
    // });

    sleep(2)


}