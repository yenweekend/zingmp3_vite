import { createSlice } from "@reduxjs/toolkit";
const searchSlice = createSlice({
    name:'search',
    initialState: {
        keyword: null,
    },
    reducers:{
        setKeyword :(state, actions) => {
            state.keyword = actions.payload;
        }
    }
})
export default searchSlice.reducer;
export const {setKeyword} = searchSlice.actions;