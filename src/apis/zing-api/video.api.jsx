import axios from "axios";
import { apiUrl } from "../../utils/constants";
export const getVideo = async (id) => {
  const response = await axios.get(`${apiUrl}api/data/video?id=${id}`);
  return response;
};
