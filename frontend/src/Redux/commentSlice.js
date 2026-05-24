import { createSlice } from "@reduxjs/toolkit";

const commentSlice = createSlice({
    name:"comment",
    initialState:{
        loading:false,
        comment:[],
    },
    reducers:{
        setLoading:(state, action) => {
            state.loading = action.payload;
        },
        setComment:(state, action) => {
            state.comment = action.payload;
        },
        resetComment:(state) => {
            state.loading = false;
            state.comment = [];
        }
    }
});
export const {setLoading, setComment, resetComment} = commentSlice.actions;
export default commentSlice.reducer;