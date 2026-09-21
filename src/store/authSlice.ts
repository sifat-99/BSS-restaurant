import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface AuthUser {
    id?: string | number;
    fullName?: string;
    userName?: string;
    email?: string;
    phoneNumber?: string;
    image?: string;
}

export interface LoginPayload {
    token?: string;
    refreshToken?: string;
    user?: AuthUser | null;
    username?: string;
    password?: string;
}

export interface AuthState {
    token: string | null;
    refreshToken: string | null;
    user: AuthUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    token: localStorage.getItem("token"),
    refreshToken: localStorage.getItem("refreshToken"),
    user: JSON.parse(localStorage.getItem("user") || "null") as AuthUser | null,
    isAuthenticated: !!localStorage.getItem("token"),
    isLoading: false,
    error: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        startLoading: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        stopLoading: (state) => {
            state.isLoading = false;
        },
        login: (state, action: PayloadAction<LoginPayload>) => {
            state.token = action.payload.token ?? null;
            state.refreshToken = action.payload.refreshToken ?? null;
            state.user = action.payload.user ?? null;
            state.isAuthenticated = true;
        },
        logout: (state:any) => {
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
