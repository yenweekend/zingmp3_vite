import axios from "axios";
import { apiUrl } from "../../utils/constants";
export const getAlbum = async (albumId) => {
  const response = await axios.get(
    `${apiUrl}/api/data/detailplaylist?id=${albumId}`
  );
  return response;
};
