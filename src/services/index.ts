import type { Client } from "@/types/openapi.d.ts";
import OpenAPIClientAxios from "openapi-client-axios";

const api = new OpenAPIClientAxios({
    definition: "http://localhost:3000/api-json",
    withServer: {
        url: "http://localhost:3000"
    },
    axiosConfigDefaults: {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`
        }
    }
});
api.init();

export const APIClient = async () => api.getClient<Client>();
