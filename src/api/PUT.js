import { api } from "./API";

export const UpdateEmployeeAPI = async (id, data, token) => {
    try {
        const response = await api.put(`/api/Employee/update/${id}`, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const UpdateTableAPI = async (id, data, token) => {
    try {
        const response = await api.put(`/api/Table/update/${id}`, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const UpdateFoodAPI = async (id, data, token) => {
    try {
        const response = await api.put(`/api/Food/update/${id}`, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const UpdateOrderStatusAPI = async (id, data, token) => {
    try {
        const response = await api.put(`/api/Order/update-status/${id}`, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        throw error;
    }
};
