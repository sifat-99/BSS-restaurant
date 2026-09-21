import { api } from "./API";

export const GetProfileAPI = async (token: string) => {
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

export const GetDashboardStatsAPI = async ({ token, month, year }: { token: string; month?: any; year?: any }) => {
    try {
        const params: { [key: string]: any } = {};
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

export const GetEmployeeDatatableAPI = async (token : string, page = 1, perPage = 10, search = "") => {
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

export const GetTableListAPI = async (token: string, page = 1, perPage = 10, search = "") => {
    try {
        const response = await api.get(`api/Table/datatable`, {
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

export const GetFoodListApi = async (token : string, page = 1, perPage = 10, search = "") => {
    try {
        const response = await api.get(`api/Food/datatable`, {
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

export const GetAllOrdersDataTableApi = async (token : string, page = 1, perPage = 10, search = "", sort = "", status = "") => {
    try {
        const params: { [key: string]: any } = {
            Page: page,
            Per_Page: perPage,
        };
        if (search) params.Search = search;
        if (sort) params.Sort = sort;
        if (status !== "") params.Status = status;

        const response = await api.get(`api/Order/datatable`, {
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

export const GetNonAssignedEmployeesAPI = async (token: string, tableId: string) => {
    try {
        const response = await api.get(`/api/Employee/non-assigned-employees/${tableId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response;
    } catch (error) {
        throw error;
    }
};
