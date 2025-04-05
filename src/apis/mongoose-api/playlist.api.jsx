import axios from "axios";
import { apiUrl } from "../../utils/constants";
export const addPlaylistToCollection = async (formData) => {
  const response = await axios.post(
    `${apiUrl}/api/playlist/addplaylisttocollection`,
    formData
  );
  return response;
};
export const updatePlaylistCreated = async (data) => {
  const response = await axios.patch(
    `${apiUrl}/api/playlist/updateplaylistcreated/${data.id}`,
    data.formData
  );
  return response;
};
export const createPlaylist = async (formData) => {
  const response = await axios.post(
    `${apiUrl}/api/playlist/createplaylist`,
    formData
  );
  return response;
};
export const getPlaylistCreated = async () => {
  const response = await axios.get(`${apiUrl}/api/playlist/getplaylistcreated`);
  return response;
};
export const getPlaylistDetail = async (encodeId) => {
  const response = await axios.get(
    `${apiUrl}/api/playlist/getplaylistdetail/${encodeId}`
  );
  return response;
};
export const getPlaylistCollection = async () => {
  const response = await axios.get(
    `${apiUrl}/api/playlist/getplaylistcollections`
  );
  return response;
};
export const getCollection = async () => {
  const response = await axios.get(`${apiUrl}/api/playlist/getcollection`);
  return response;
};
export const deletePlaylistCreated = async (id) => {
  const response = await axios.delete(
    `${apiUrl}/api/playlist/deleteplaylistcreated/${id}`
  );
  return response;
};
export const deletelaylistFromCollection = async (encodeId) => {
  const response = await axios.delete(
    `${apiUrl}/api/playlist/deleteplaylistfromcollection/${encodeId}`
  );
  return response;
};
