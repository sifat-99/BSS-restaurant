import { BACKEND_API, api } from "./API";

export const SignInAPI = async ({ username, password }) => {

    try {
        const response = await api.post(`/api/Auth/signIn`, {
            "userName": username,
            "password": password
        });
        return response;
    } catch (error) {
        throw error;
    }
}

export const CreateEmployeeAPI = async (data, token) => {
    try {
        const response = await api.post(`/api/Employee/create`, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const CreateTableAPI = async (data, token) => {
    try {
        const response = await api.post(`/api/Table/create`, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const CreateFoodAPI = async (data, token) => {
    try {
        const response = await api.post(`/api/Food/create`, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const CreateEmployeeTableRangeAPI = async (data, token) => {
    try {
        const response = await api.post(`/api/EmployeeTable/create-range`, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response;
    } catch (error) {
        throw error;
    }
};