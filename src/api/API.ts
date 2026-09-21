import axios from "axios";
import { store } from "../store/store";
import { logout } from "../store/authSlice";

export const BACKEND_API = "https://bssrms.runasp.net";

export const api = axios.create({
    baseURL: BACKEND_API,
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            store.dispatch(logout());
        }
        return Promise.reject(error);
    }
);
