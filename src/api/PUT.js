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
