import router from '@/router';
import { useAxiosStore } from '@/store/axiosStore';
import { MessageApiInjection } from 'naive-ui/es/message/src/MessageProvider'
const axiosStore = useAxiosStore();

let request = axiosStore.axiosInstance

export async function get(message: MessageApiInjection, url: string, params: any) {
    try {
        const res = await request.get(url, { params: params });
        if (res.status === 200) {
            if (res.data.code === 200) {
                return res.data.data;
            } else {
                let code = res.data.code
                if (code === 400) {
                    message.warning(res.data.message)
                } else if (code === 401) {
                    message.warning(res.data.message)
                    router.push('/login')
                }
                return false;
            }
        } else {
            message.error("网络错误！");
            return false;
        }
    }
    catch {
        console.log('请求错误：' + url);
        console.log(params);
    }
}

export async function post(message: MessageApiInjection, url: string, props: any) {
    try {
        const res = await request.post(url, props);
        if (res.status === 200) {
            if (res.data.code === 200) {
                message.success(res.data.message)
                return res.data.data;
            } else {
                let code = res.data.code
                if (code === 400) {
                    message.warning(res.data.message)
                } else if (code === 401) {
                    message.warning(res.data.message)
                    router.push('/login')
                }
                return false;
            }
        } else {
            message.error("网络错误！");
            return false;
        }
    }
    catch {
        console.log('请求错误：' + url);
        console.log(props);
    }
}

export async function postWithParam(message: MessageApiInjection, url: string, props: any, params: any) {
    try {
        const res = await request.post(url, props, { params: params });
        if (res.status === 200) {
            if (res.data.code === 200) {
                message.success(res.data.message)
                return res.data.data;
            } else {
                let code = res.data.code
                if (code === 400) {
                    message.warning(res.data.message)
                } else if (code === 401) {
                    message.warning(res.data.message)
                    router.push('/login')
                }
                return false;
            }
        } else {
            message.error("网络错误！");
            return false;
        }
    }
    catch {
        console.log('请求错误：' + url);
        console.log(props);
    }
}


export default request