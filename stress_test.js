import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    scenarios: {
        stress: {
        executor: "ramping-arrival-rate",
        preAllocatedVUs: 500,
        timeUnit: "1s",
        stages: [
            { duration: "2m", target: 10 }, // below normal load
            { duration: "5m", target: 10 },
            { duration: "2m", target: 20 }, // normal load
            { duration: "5m", target: 20 },
            { duration: "2m", target: 30 }, // around the breaking point
            { duration: "5m", target: 30 },
            { duration: "2m", target: 40 }, // beyond the breaking point
            { duration: "5m", target: 40 },
            { duration: "10m", target: 0 }, // scale down. Recovery stage.
        ],
        },
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
        job: 'leaderr',
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