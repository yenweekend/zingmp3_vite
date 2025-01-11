import { createSlice } from "@reduxjs/toolkit";
const historySlice = createSlice({
  name: "search",
  initialState: {
    mv: [],
    song: [],
    playlist: [],
  },
  reducers: {
    setMVHistory: (state, actions) => {
      const newItem = actions.payload;
      const existingIndex = state.mv.findIndex(
        (item) => item.encodeId === newItem.encodeId
      );

      // Remove the existing item if it exists
      if (existingIndex !== -1) {
        state.mv.splice(existingIndex, 1);
      }

      // Add the new item to the beginning of the array
      state.mv.unshift(newItem);

      // Ensure the array length does not exceed 20
      if (state.mv.length > 20) {
        state.mv.pop();
      }
    },
    setPlaylistHistory: (state, actions) => {
      const newItem = actions.payload;
      const existingIndex = state.mv.findIndex(
        (item) => item.encodeId === newItem.encodeId
      );

      // Remove the existing item if it exists
      if (existingIndex !== -1) {
        state.playlist.splice(existingIndex, 1);
      }

      // Add the new item to the beginning of the array
      state.playlist.unshift(newItem);

      // Ensure the array length does not exceed 20
      if (state.playlist.length > 20) {
        state.playlist.pop();
      }
    },
    setSongHistory: (state, actions) => {
      const newItem = actions.payload;
      const existingIndex = state.mv.findIndex(
        (item) => item.encodeId === newItem.encodeId
      );

      // Remove the existing item if it exists
      if (existingIndex !== -1) {
        state.song.splice(existingIndex, 1);
      }

      // Add the new item to the beginning of the array
      state.song.unshift(newItem);

      // Ensure the array length does not exceed 20
      if (state.song.length > 20) {
        state.song.pop();
      }
    },
  },
});
export default historySlice.reducer;
export const { setMVHistory, setPlaylistHistory, setSongHistory } =
  historySlice.actions;
