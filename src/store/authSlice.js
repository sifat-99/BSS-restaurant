import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        token: localStorage.getItem("token") || null,
        refreshToken: localStorage.getItem("refreshToken") || null,
        user: JSON.parse(localStorage.getItem("user") || "null"),
        isAuthenticated: !!localStorage.getItem("token"),
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
            state.token = action.payload.token;
            state.refreshToken = action.payload.refreshToken;
            state.user = action.payload.user;
            state.isAuthenticated = true;
        },
        logout: (state) => {
            state.token = null;
            state.refreshToken = null;
            state.user = null;
            state.isAuthenticated = false;
            state.isLoading = false;
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");
        }
    }
});

export const { login, logout, startLoading, stopLoading } = authSlice.actions;
export default authSlice;