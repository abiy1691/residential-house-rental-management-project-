import axios from '../axiosUtils';

export const getTenant = async (tenantid) => {
    try {
        const response = await axios.get(`tenant/id`);
        return response.data
    } catch (error) {
        throw error
    }
}

export const editTenant = async (payload) => {
    const response = await axios.put('tenant/', payload, {headers: {'Content-Type': 'multipart/form-data'}});
    return response.data;
}

export const createMaintenance = async ({_id, description, status, reopen}) => {
    let response = null
    if (reopen && status) {
        response = await axios.put('tenant/maintenance/edit/'+_id)
    }
    else if (status) {
        response = await axios.delete('tenant/maintenance/'+_id) 
    }
    else if (_id)
        response = await axios.put('tenant/maintenance/'+_id, {description});
    else
        response = await axios.post('tenant/maintenance', {description});
    return response.data;
}

export const fetchMaintenance = async () => {
    const response = await axios.get('tenant/maintenance');
    return response.data;
}

export const fetchOwner = async () => {
    const response = await axios.get('tenant/owner')
    return response.data
}

export const getHouse = async () => {
    const response = await axios.get('tenant/house')
    return response.data
}

export const payrent = async (payload) => {
    const form = new FormData();
    payload.paid_to = JSON.stringify(payload.paid_to)
    Object.entries(payload).forEach(([key, val]) => {form.append(key, val)});
    
    let response = null;
    if (payload.id && payload.id !== '')
        response = await axios.put('tenant/payrent/'+payload.id, form, {headers: {'Content-Type': 'multipart/form-data'}});
    else
        response = await axios.post('tenant/payrent', form, {headers: {'Content-Type': 'multipart/form-data'}});
    return response.data;
}

export const getHistory = async () => {
    const history = await axios.get('tenant/history');
    return history.data
}
