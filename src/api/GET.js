import axios from "axios";
import { BACKEND_API } from "./API";

export const GetProfileAPI = async (token) => {
    try {
        const response = await axios.get(`${BACKEND_API}/api/Auth/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const GetDashboardStatsAPI = async ({ token, month, year }) => {
    try {
        const params = {};
        if (month) params.Month = month;
        if (year) params.Year = year;

        const response = await axios.get(`${BACKEND_API}/api/Dashboard/stats`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params
        });
        return response;
    } catch (error) {
        throw error;
    }
};
