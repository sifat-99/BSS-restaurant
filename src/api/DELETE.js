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
