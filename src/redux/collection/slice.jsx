import { createSlice } from "@reduxjs/toolkit";
const collectionSlice = createSlice({
  name: "mycollect",
  initialState: {
    song: [],
    playlist: [],
  },
  reducers: {
    setCollection: (state, actions) => {
      state.song = actions.payload.song || state.song;
      state.playlist = actions.payload.playlist || state.playlist;
    },
  },
});
export default collectionSlice.reducer;
export const { setCollection } = collectionSlice.actions;
