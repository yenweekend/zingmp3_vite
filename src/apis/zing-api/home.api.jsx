import axios from "axios";
import { apiUrl } from "../../utils/constants";
export const getHome = async () => {
  const response = await axios.get(`${apiUrl}/api/data/home`);
  return response;
};
export const getZingChart = async () => {
  const response = await axios.get(`${apiUrl}/api/data/charthome`);
  return response;
};
export const getHub = async () => {
  const response = await axios.get(`${apiUrl}/api/data/hub`);
  return response;
};

export const getHubDetail = async (hubId) => {
  const response = await axios.get(
    `${apiUrl}/api/data/gethubdetail?id=${hubId}`
  );
  return response;
};
export const getSocialBoard = async () => {
  const response = await axios.get(`${apiUrl}/api/data/newreleasechart`);
  return response;
};
export const getSuggest = async () => {
  const response = await axios.get(`${apiUrl}/api/data/recommend`);
  return response;
};
export const getSearch = async (keyword) => {
  const response = await axios.get(
    `${apiUrl}/api/data/suggestkeyword?keyword=${keyword}`
  );
  return response;
};
