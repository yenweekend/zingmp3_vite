import axios from "axios";
import { apiUrl } from "../../utils/constants";
export const getSinger = async (singerName) => {
  const response = await axios.get(
    `${apiUrl}api/data/artist?name=${singerName}`
  );
  return response;
};
