import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:4001/',
});

const refreshToken = async () => {
    const refreshtoken = localStorage.getItem('refreshtoken') || '';
    return axios.post('http://localhost:4001/user/refresh', {refreshtoken});
}

axiosInstance.interceptors.request.use(async (config) => {
    const accesstoken = localStorage.getItem("accesstoken") || '';
    config.headers['Authorization'] = `Bearer ${accesstoken}`;
    return config;
});

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response && error.response.status == 401) {
            try {
                const newToken = await refreshToken();
                
                axiosInstance.defaults.headers.common['Authorization'] = "Bearer "+newToken.data.accesstoken;

                localStorage.setItem('accesstoken', newToken.data.accesstoken)

                const oldRequest = error.config;
                oldRequest.headers["Authorization"] = "Bearer "+newToken.data.accesstoken;

                return axios(oldRequest);
            } catch (error) {
                return Promise.reject(error);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;