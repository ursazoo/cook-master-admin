import axios, { AxiosRequestConfig, Method } from 'axios';
import Cookies from 'js-cookie';

interface Data {
  [key: string]: unknown;
}

interface Response {
  code: number;
  message: string;
  data: any;
}

// 使用 .env 中定义的环境变量进行动态拼接请求地址
axios.defaults.baseURL = '';
// axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';

// 请求超时的等待时间,覆写库的超时默认值
// 在超时前，所有请求都会等待 5 秒
axios.defaults.timeout = 5000;

// 全局请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么 可更改请求的配置，比如在headers添加通用的token
  config.headers['Authorization'] = `Bearer ${
    Cookies.get('Authorization') || ''
  }`; //设置token
  return config;
});

// 全局响应拦截器
axios.interceptors.response.use(
  function (response) {
    // 对响应数据做点什么 可指定返回的内容
    let data: any = {};

    // console.log(response);

    if (!response?.data?.code) {
      data = response.data;
      // if (data.code === ErrorCode['登录状态已失效']) Cookies.remove('Authorization');
      return data;
    }

    // 业务上出现请求异常
    if (response?.data?.code) {
      // Toast.fail(response?.data?.message);
      // store.commit('loading/hide');
      return Promise.resolve(response?.data);
      // return Promise.reject(new Error(response?.data?.message || 'Error'));
    }
  },
  function (error) {
    // 对响应错误做点什么 都返回resolve去处理这样做的好处就是不需要再在每个请求里边写catch错误处理的方法了
    // 这里返回的内容可一个自定义通用的处理方式
    // Toast.fail(error?.data?.message ?? '网络异常');
    // store.commit('loading/hide');
    // return Promise.resolve(error?.data);
    return Promise.reject(new Error(error?.data?.message || 'Error'));
  }
);

// const isData = ['POST', 'PUT', 'PATCH'];

// export const http = {
//     _requestHandler(
//         method: AxiosRequestConfig['method'] = 'get',
//         url = '',
//         data?: Data,
//         params?: Data,
//         config?: Data
//     ) {
//         method = method.toLocaleUpperCase() as Method;
//         data = data || {};
//         config = config || {};
//         params = params || {};
//         // if (isData.indexOf(method) >= 0) {
//         //     config.data = data;
//         // } else {
//         //     config.params = data;
//         // }

//         return axios.request<any>({
//             ...config,
//             method,
//             url
//         });
//     },
//     get(url = '', params?: Data, config?: Data): Response | any {
//         return http._requestHandler('GET', url, params, config);
//     },
//     post(url = '', data?: Data, config?: Data) {
//         return http._requestHandler('POST', url, data, config);
//     },
//     delete(url = '', data?: Data, config?: Data) {
//         return http._requestHandler('DELETE', url, data, config);
//     },
//     put(url = '', params?: Data, config?: Data) {
//         return http._requestHandler('PUT', url, params, config);
//     },
//     patch(url = '', params?: Data, config?: Data) {
//         return http._requestHandler('PATCH', url, params, config);
//     },
//     request: axios.request
// };

// export function request(url: string, { method, data, params }: { method: Method; data?: any; params?: any }): any {
//     return http._requestHandler(method, url, data, params);
// }

export default axios;
