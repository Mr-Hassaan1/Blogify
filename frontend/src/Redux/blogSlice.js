import { createSlice } from "@reduxjs/toolkit";

const blogSlice = createSlice({
    name: "blog",
    initialState: {
        loading: false,
        blog: []
    },
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        setBlog: (state, action) => {
            state.blog = action.payload
        },
        resetBlog: (state) => {
            state.loading = false
            state.blog = []
        }

    }
})

export const { setLoading, setBlog, resetBlog } = blogSlice.actions
export default blogSlice.reducer