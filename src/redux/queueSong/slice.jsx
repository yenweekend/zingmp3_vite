import { createSlice } from "@reduxjs/toolkit";
const queueSongSlice = createSlice({
  name: "queueSong",
  initialState: {
    queue_song: {},
    cursongEncodeId: null,
    currentId: null,
  },
  reducers: {
    resetQueueSong: (state) => {
      state.queue_song = {};
      state.cursongEncodeId = null;
      state.currentId = null;
    },
    //play a new song or play new playlist
    setQueueSong: (state, actions) => {
      const { queue_song, currentId, cursongEncodeId } = actions.payload;
      state.queue_song = queue_song;
      state.currentId = currentId;
      state.cursongEncodeId = cursongEncodeId;
    },
    // add song to list play
    putQueueSong: (state, actions) => {
      const { queue_song } = actions.payload;
      state.queue_song = { ...state.queue_song, ...queue_song };
    },
    setSongId: (state, actions) => {
      const { songId, cursongEncodeId } = actions.payload;
      state.currentId = songId;
      state.cursongEncodeId = cursongEncodeId;
    },
    deleteSongFromQueue: (state, actions) => {
      const id = actions.payload;
      const { [id]: _, ...rest } = state.queue_song;
      state.queue_song = rest;
    },
  },
});
export default queueSongSlice.reducer;
export const {
  setQueueSong,
  setSongId,
  putQueueSong,
  deleteSongFromQueue,
  resetQueueSong,
} = queueSongSlice.actions;
