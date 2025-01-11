import { createSlice } from "@reduxjs/toolkit";
const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLogin: false,
    username: null,
  },
  reducers: {
    setAccount: (state, actions) => {
      state.username = actions.payload.username || null;
      state.isLogin = actions.payload.isLogin || false;
    },
  },
});
export default authSlice.reducer;
export const { setAccount } = authSlice.actions;
