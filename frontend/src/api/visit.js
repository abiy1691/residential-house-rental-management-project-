import axios from "../axiosUtils"


export const fetchVisitRequests = async () => {
    const response = await axios.get('user/schedules');
    return response.data;
}

export const deleteVisitRequests = async (id) => {
    const response = await axios.delete('user/schedules/'+id);
    return response.data
}
