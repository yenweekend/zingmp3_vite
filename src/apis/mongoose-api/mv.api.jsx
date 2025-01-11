import axios from "axios";
import { apiUrl } from "../../utils/constants";
export const addFavoriteMV = async (formData) => {
  const response = await axios.post(
    `${apiUrl}api/mv/addmvtocollection`,
    formData
  );
  return response;
};
export const deleteMVFromCollection = async (encodeId) => {
  const response = await axios.delete(
    `${apiUrl}api/mv/deletemvfromcollection/${encodeId}`
  );
  return response;
};
export const getMVCollection = async (encodeId) => {
  const response = await axios.get(`${apiUrl}api/mv/getmvcollection`);
  return response;
};
