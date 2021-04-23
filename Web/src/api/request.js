import axios from 'axios'
import conf from '@/web.conf'
import store from '../store/index'
import { MessageBox } from 'element-ui';
/***
 * 注意事项：
 * 1.没处理中文，不可以传中文
 */

// 环境的切换
if (process.env.NODE_ENV == 'development') {
    axios.defaults.baseURL = conf.dev_base_url
} else if (process.env.NODE_ENV == 'debug') {
    axios.defaults.baseURL = conf.dev_base_url
} else if (process.env.NODE_ENV == 'production') {
    axios.defaults.baseURL = conf.pro_base_url
}

// 创建一个axios实例
const request = axios.create({
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json;charset=UTF-8'
    },
    transformRequest: [function (data,headers) {
        // 对 data 进行任意转换处理
        data = JSON.stringify(data)
        return data;
    }],
    // `transformResponse` 在传递给 then/catch 前，允许修改响应数据
    transformResponse: [function (data) {
        // 对 data 进行任意转换处理
        return data;
    }],
    timeout: 5000
})

// 添加请求拦截器
request.interceptors.request.use(config => {
    // 在发送请求之前设置token
    config.headers.Authorization = store.state.token;
    return config;
}, error => {
    // 请求错误时做些事
    return Promise.reject(error);
});

// 添加响应拦截器
request.interceptors.response.use(response => {
    console.log("debug："+response)
    // 如果返回的状态不是200 就主动报错
    if (response.status != 200) {
        return Promise.reject(response.message || 'error')
    } else{
        let data = JSON.parse(response.data)
        if(data.no < -1){
            MessageBox.alert(data.msg, '通知', {type: 'error'})
            return Promise.reject("异常拦截终止"); // 返回接口返回的错误信息
        }else{
            return data
        }
    }
}, error => {
    MessageBox.alert(error.message, '通知', {type: 'error'})
    // return Promise.reject(error.response); // 返回接口返回的错误信息
})

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export var get = function (url, params, headers = {}) {
    // eslint-disable-next-line no-unused-vars
    return new Promise((resolve, reject) => {
        request.get(url, {
            params: params,
            headers: headers
        })
            .then(data => {
                resolve(data);
            })
            .catch(err => {
                // reject(err.data)
                console.debug(err.data)
            })
    });
}
/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export var post = function (url, data, headers={}) {
    // eslint-disable-next-line no-unused-vars
    return new Promise((resolve, reject) => {
        request.post(url, data, {headers: headers})
            .then(data => {
                resolve(data);
            })
            .catch(err => {
                // reject(err.data)
                console.debug(err.data)
            })
    });
}

export default request
