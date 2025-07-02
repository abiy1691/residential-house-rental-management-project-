import axios from "../axiosUtils"

export const download = async (url) => {
    const response = await axios.get('http://localhost:4001/'+url, {responseType: 'blob'})
    const imageUrl = URL.createObjectURL(response.data);
    return imageUrl
}