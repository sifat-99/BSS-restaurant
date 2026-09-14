import { api } from "./API";

export const GetProfileAPI = async (token) => {
    try {
        const response = await api.get(`/api/Auth/profile`, {
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

        const response = await api.get(`/api/Dashboard/stats`, {
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

export const GetEmployeeDatatableAPI = async (token, page = 1, perPage = 10, search = "") => {
    try {
        const response = await api.get(`/api/Employee/datatable`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                Page: page,
                Per_Page: perPage,
                Search: search
            }
        });
        return response;
    } catch (error) {
        throw error;
    }
};
