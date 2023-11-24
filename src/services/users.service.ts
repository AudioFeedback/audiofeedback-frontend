import type { Paths } from "@/types/openapi";
import { APIClient } from ".";

export async function getUsers() {
    const client = await APIClient();

    return client.UsersController_findAll();
}

export async function getUser(id: number) {
    const client = await APIClient();

    return client.UsersController_findOne(id);
}

export async function createUser(body: Paths.UsersControllerCreate.RequestBody) {
    const client = await APIClient();

    return client.UsersController_create(null, body);
}

export async function updateUser(body: Paths.UsersControllerUpdate.RequestBody, id: number) {
    const client = await APIClient();

    return client.UsersController_update(id, body);
}

export async function deleteUser(id: number) {
    const client = await APIClient();

    return client.UsersController_remove(id);
}

export async function getReviewers() {
    const client = await APIClient();

    return client.UsersController_getReviewers();
}
