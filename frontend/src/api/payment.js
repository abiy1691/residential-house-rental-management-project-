import axios from "../axiosUtils"

export const intilizePayment = async({user}) =>{

    const response = await axios.get('/payment/payment-initialization')
    console.log(response,'here is responsone ')
    return response.data;
}