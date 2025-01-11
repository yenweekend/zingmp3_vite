import axios from "axios";
import { apiUrl } from "../../utils/constants";
export const addSongToCollection = async (formData) => {
  const response = await axios.post(
    `${apiUrl}api/song/addsongtocollection`,
    formData
  );
  return response;
};
export const deleteSongFromCollection = async (encodeId) => {
  const response = await axios.delete(
    `${apiUrl}api/song/deletesongfromcollection/${encodeId}`
  );
  return response;
};
export const deleteSongFromPlaylist = async (data) => {
  const response = await axios.post(
    `${apiUrl}api/song/deletesongfromplaylist/${data.id}`,
    data.formData
  );
  return response;
};
export const addSongToPlaylist = async (data) => {
  const response = await axios.post(
    `${apiUrl}api/song/addsonginplaylist/${data.id}`,
    data.formData
  );
  return response;
};
export const addMutipleSongToPlaylist = async (data) => {
  const response = await axios.post(
    `${apiUrl}api/song/addmutiplesonginplaylist/${data.id}`,
    data.formData
  );
  return response;
};

export const getSongCollection = async () => {
  const response = await axios.get(`${apiUrl}api/song/getsongcollection`);
  return response;
};
