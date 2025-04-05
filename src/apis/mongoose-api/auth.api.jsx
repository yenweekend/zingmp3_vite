import axios from "axios";
import { apiUrl } from "../../utils/constants";
export const register = async (formData) => {
  const response = await axios.post(`${apiUrl}/api/auth/register`, formData);
  return response;
};
export const login = async (formData) => {
  const response = await axios.post(`${apiUrl}/api/auth/login`, formData);
  return response;
};
