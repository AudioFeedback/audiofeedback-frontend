import type { Client } from "@/types/openapi.d.ts";
import OpenAPIClientAxios from "openapi-client-axios";

const api = new OpenAPIClientAxios({
    definition: `http://${import.meta.env.VITE_SERVER_IP}/api-json`,
    withServer: {
        url: `http://${import.meta.env.VITE_SERVER_IP}`
    },
    axiosConfigDefaults: {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`
        }
    }
});
api.init();

export const APIClient = async () => api.getClient<Client>();
