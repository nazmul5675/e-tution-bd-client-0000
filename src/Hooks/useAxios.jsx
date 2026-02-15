import axios from "axios";
import { getAuth, signOut } from "firebase/auth";

const axiosInstance = axios.create({
    baseURL: "http://localhost:3000/",
});


axiosInstance.interceptors.request.use(
    async (config) => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
            const token = await user.getIdToken();
            config.headers.authorization = `Bearer ${token}`;

        }


        return config;
    },
    (error) => Promise.reject(error)
);


axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const status = error?.response?.status;

        if (status === 401 || status === 403) {

            try {
                await signOut(getAuth());
            } catch (e) {

            }
            window.location.replace("/login");
        }

        return Promise.reject(error);
    }
);

const useAxios = () => axiosInstance;
export default useAxios;
