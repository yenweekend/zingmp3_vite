import { createSlice } from "@reduxjs/toolkit";

const songSlice = createSlice({
  name: "currentSong",
  initialState: {
    isPlaying: false,
  },
  reducers: {
    setIsPlaying: (state, action) => {
      state.isPlaying = action.payload;
    },
  },
});

export default songSlice.reducer;
export const { setIsPlaying } = songSlice.actions;
