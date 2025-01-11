import axios from "axios";
import { apiUrl } from "../../utils/constants";
export const getAllSearch = async (keyword) => {
  const response = await axios.get(
    `${apiUrl}api/data/search?keyword=${keyword}`
  );
  return response;
};
