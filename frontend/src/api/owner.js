import axios from "../axiosUtils"
export const createowner = async (payload) => {
    const response = await axios.post('owner', payload, {headers: {'Content-Type': 'multipart/form-data'}});

    const {refreshtoken, accesstoken, ...savedOwner} = response.data;
    
    localStorage.setItem('refreshtoken', refreshtoken);
    localStorage.setItem('accesstoken', accesstoken);
    
    axios.defaults.headers.common['Authorization'] = `Bearer ${accesstoken}`;

    return savedOwner
}

export const editowner = async (payload) => {
    const form = new FormData();
    payload.address = JSON.stringify(payload.address)
    Object.entries(payload).forEach(([key, val]) => {form.append(key, val)});
    const response = await axios.put('owner/', form, {headers: {'Content-Type': 'multipart/form-data'}});
    return response.data
}

export const getHouses = async () => {
    const response = await axios.get('owner/houses')
    return response.data 
}

export const getSingleHouse = async (houseid) => {
    const response = await axios.get('owner/houses/'+houseid)
    return response.data 
}

export const addTenant = async({formData, houseId}) =>{
     const response = await axios.post(`owner/${houseId}`, formData);
     return response.data
}

export const cerateCallendar = async ({d, houseid}) => {
    const response = await axios.post(`owner/${houseid}/calendar`, {schedules: d});
    return response.data
}

export const editHouse = async ({houseid, ...data}) => {
    const response = await axios.put(`owner/${houseid}`, data);
    return response.data
}

export const editHouseImages = async ({houseid, form}) => {
    const response = await axios.put(`owner/${houseid}/images`, form);
    return response.data
}

export const getTenant = async (tenantid) => {
    try {
        const response = await axios.get(`tenant/${tenantid}`);
        return response.data
    } catch (error) {
        throw error
    }
}

export const getMaintenance = async () => {
    try {
        const response = await axios.get('owner/maintenance')
        return response.data
    } catch (error) {
        throw error
    }
}

export const changeStatus = async (id) => {
    const response = await axios.put('owner/maintenance/'+id)
    return response.data
}

export const getVisitors = async (q) => {
    try {
        console.log(q)
        const response = await axios.get('owner/requests?'+q)
        return response.data
    } catch (error) {
        throw error
    }
}

export const getHistory = async (q) => {
    const response = await axios.get('owner/history/?'+q)
    return response.data
}

export const removeTenant = async (id) => {
    const response = await axios.delete('owner/'+id+'/tenant');
    return response.data;
}

export const paymentHistory = async () => {
    const response = await axios.get('owner/payments');
    return response.data
}

export const paymentActions = async ({hid, pid, accept}) => {
    const response = await axios.post('owner/'+hid+'/'+pid, {accept});
    return response.data
}