import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiUrl } from "../../utils/constants";
import axios from "axios";
// export const getAudio = createAsyncThunk(
//   "song/audio",
//   async (encodeId, thunkAPI) => {
//     try {
//       const response = await axios.get(
//         `${apiUrl}/api/song/getaudio?id=${encodeId}`,
//         {
//           withCredentials: true,
//         }
//       );
//       console.log(response);
//       return response.data.audio;
//     } catch (error) {
//       console.log("--get audio  error: ", error);
//       // return thunkAPI.rejectWithValue("Phiên đã hết hạn");
//     }
//   }
// );

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
  // extraReducers: (builder) => {
  //   builder
  //     .addCase(getAudio.pending, (state, action) => {
  //       state.loading = true;
  //       state.error = null;
  //     })
  //     .addCase(getAudio.fulfilled, (state, action) => {
  //       state.loading = false;
  //       state.audio = action.payload;
  //       state.error = null;
  //     })
  //     .addCase(getAudio.rejected, (state, action) => {
  //       state.loading = false;
  //       state.audio = null;
  //       state.error = action.payload;
  //     });
  // },
});

export default songSlice.reducer;
export const { setIsPlaying } = songSlice.actions;
