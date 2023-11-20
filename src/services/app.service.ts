import type { Paths } from "@/types/openapi";
import { APIClient } from ".";

export async function getProfile() {
    const client = await APIClient();

    return client.AppController_getProfile();
}

export async function login(body: Paths.AppControllerLogin.RequestBody) {
    const client = await APIClient();

    return client.AppController_login(null, body);
}
