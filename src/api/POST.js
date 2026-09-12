import axios from "axios";
import { BACKEND_API } from "./API";

export const SignInAPI = async ({ username, password }) => {

    try {
        const response = await axios.post(`${BACKEND_API}/api/Auth/signIn`, {
            "userName": username,
            "password": password
        });
        return response;
    } catch (error) {
        throw error;
    }
}