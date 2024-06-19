import type { Client } from "@/types/openapi.d.ts";
import OpenAPIClientAxios from "openapi-client-axios";

const api = new OpenAPIClientAxios({
    definition: `${import.meta.env.VITE_API_URL}/api-json`,
    withServer: {
        url: `${import.meta.env.VITE_API_URL}`
    },
    axiosConfigDefaults: {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`
        }
    }
});
api.init();

export const APIClient = async () => api.getClient<Client>();
