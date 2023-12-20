import { defineStore } from 'pinia';
import axios from 'axios';

export const useAxiosStore = defineStore('axiosStore', {
    state: () => ({
        persist: true,
        axiosInstance: axios.create({
            // TODO:补充后端接口
            baseURL: 'http://121.36.81.4:8088',
            timeout: 5000,
            headers: {
                'Authorization': localStorage.getItem('token') || '',
            },
        }),
    }),
    actions: {
        // 在获取token后给本axios实例补token
        updateAuthorizationHeader(newToken: string) {
            this.axiosInstance.defaults.headers['Authorization'] = newToken;
        },
    },
});