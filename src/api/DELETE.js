import { api } from "./API";

export const DeleteEmployeeAPI = async (id, token) => {
    try {
        const response = await api.delete(`/api/Employee/delete/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const DeleteTableAPI = async (id, token) => {
    try {
        const response = await api.delete(`/api/Table/delete/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const DeleteFoodAPI = async (id, token) => {
    try {
        const response = await api.delete(`/api/Food/delete/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        throw error;
    }
};
