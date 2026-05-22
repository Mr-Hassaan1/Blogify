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
        }  
    }
});
export const {setLoading, setComment} = commentSlice.actions;
export default commentSlice.reducer;