import type { Paths } from "@/types/openapi";
import { APIClient } from ".";

export async function getUsers() {
    const client = await APIClient();

    return client.UsersController_findAll();
}

export async function createUser(body: Paths.UsersControllerCreate.RequestBody) {
    const client = await APIClient();

    return client.UsersController_create(null, body);
}

export async function getReviewers() {
    const client = await APIClient();

    return client.UsersController_getReviewers();
}
