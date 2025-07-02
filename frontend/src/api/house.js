import axios from '../axiosUtils'
export const createHouse = async (formData) => {
  const response = await axios.post('http://localhost:4001/house/', formData, {headers: {'Content-Type': `multipart/form-data;`},})
  return response.data;
};

export const getHouses = async (query) =>{
  const response = await axios.get('house/?limit=3&'+query)
  return response.data
}

export const getSingleHouse = async (houseid) => {
  const response = await axios.get('house/'+houseid);
  return response.data;
}

export const getHouseVisits = async (houseid) => {
  const response = await axios.get('house/'+houseid+'/visitrequests');
  return response.data;
}

export const createHouseVisitRequest = async ({houseid, date, message}) => {
  const response = await axios.post('user/'+houseid, {date, message});
  return response.data;
}
