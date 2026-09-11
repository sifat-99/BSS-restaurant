import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
    },
    reducers: {
        startLoading: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        stopLoading: (state) => {
            state.isLoading = false;
        },
        login: (state, action) => {
            state.token = action.payload;
            state.isAuthenticated = true;
        },
        logout: (state) => {
            state.token = null;
            state.isAuthenticated = false;
            state.isLoading = false;
        }
    }
})

export const { login, logout, startLoading, stopLoading } = authSlice.actions;
export default authSlice;