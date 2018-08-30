import axios from 'axios';
import _ from 'lodash';
import config from '../config.json';

const req = axios.create({
    baseURL: config.baseURL
});

const R = function (config = {}) {
    let { basepoint, endpoint, method, data } = config;
    method = _.lowerCase(method);
    let options = {
        headers: {
            'x-access-token': localStorage.getItem('accessToken'),
            'x-refresh-token': localStorage.getItem('refreshToken')
        }
    }
    if (method === 'post' || method === 'put') {
        return req[method](`${basepoint}/${endpoint}`, data, options).then(successHandler).catch(errorHandler);
    } else {
        return req[method](`${basepoint}/${endpoint}`, {
            ...options,
            params: data
        }).then(successHandler).catch(errorHandler);
    }
}

const successHandler = function (res) {
    if (res.headers['x-access-token'] && res.headers['x-refresh-token']) {
        localStorage.setItem('accessToken', res.headers['x-access-token']);
        localStorage.setItem('refreshToken', res.headers['x-refresh-token']);
    }
    if(res.status === 200) {
        return res.data;
    } else {
        throw new Error(res.data.message);
    }
}

const errorHandler = function (err) {
    alert(err.toString());
}

export const Public = {

    basepoint: '/public',

    login: function (data) {
        return R({
            basepoint: this.basepoint,
            endpoint: 'login',
            method: 'POST',
            data
        });
    },

    check: function () {
        return R({
            basepoint: this.basepoint,
            endpoint: 'check',
            method: 'GET'
        });
    },

    logout: function () {
        return R({
            basepoint: this.basepoint,
            endpoint: 'logout',
            method: 'GET'
        })
    },

    register: function (data) {
        return R({
            basepoint: this.basepoint,
            endpoint: 'register',
            method: 'POST',
            data
        });
    }

};

export const Qrs = {

    basepoint: '/qrs',

    index: function() {
        return R({
            basepoint: this.basepoint,
            endpoint: '/',
            method: 'GET'
        });
    }

}