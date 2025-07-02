import axios from "../axiosUtils";

export const signup = async (payload) => {
    const response = await axios.post('user/register', payload);
    const {refreshtoken, accesstoken, ...data} = response.data;
    localStorage.setItem('refreshtoken', refreshtoken);
    localStorage.setItem('accesstoken', accesstoken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${accesstoken}`
    return data
}

export const login = async (payload) => {
    try {
        const response = await axios.post('user/login', payload);
        const {refreshtoken, accesstoken, ...data} = response.data;
        localStorage.setItem('refreshtoken', refreshtoken);
        localStorage.setItem('accesstoken', accesstoken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${accesstoken}`
        return data
    } catch (error) {
        throw error
    }

}

export const getUser = async (id) => {
    try {
        let q = 'user'
        if (id && typeof id === 'string')
            q += '/'+id
        const response = await axios.get(q);
        return response.data;
    } catch (error) {
        throw error
    }
}

export const frogetPassword = async (email) => {
    try {
        const response = await axios.post('user/forgetpassword', {identifier: email});
        return response.data
    } catch (error) {
        throw error
    }
}

export const resetPassword = async (payload) => {
    try {
        const response = await axios.post('user/resetpassword', payload);
        const {refreshtoken, accesstoken, ...data} = response.data;
        localStorage.setItem('refreshtoken', refreshtoken);
        localStorage.setItem('accesstoken', accesstoken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${accesstoken}`
        return data
    } catch (error) {
        throw error
    }
}

export const logout = async () => {
    try {
        const refreshtoken = localStorage.getItem('refreshtoken');
        const response = await axios.post('user/logout', {refreshtoken})
        localStorage.removeItem('refreshtoken')
        localStorage.removeItem('accesstoken')
        return response;
    } catch (error) {
        throw error
    }
}

export const editprofile = async (payload, username) => {
    try {
        const response = await axios.put('user/'+payload.user, payload);
        return response.data;
    } catch (error) {
        throw error
    }
}
