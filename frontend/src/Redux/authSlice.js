import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        loading: false,
        user: null
    },
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        setUser: (state, action) => {
            state.user = action.payload
        },
        resetAuth: (state) => {
            state.loading = false
            state.user = null
        }

    }
})

export const { setLoading, setUser, resetAuth } = authSlice.actions
export default authSlice.reducer