import type { Paths } from "@/types/openapi";
import { APIClient } from ".";

export async function getAllFeedback() {
    const client = await APIClient();

    return client.FeedbackController_findAll();
}

export async function getFeedback(id: number) {
    const client = await APIClient();

    return client.FeedbackController_findOne(id);
}

export async function createFeedback(body: Paths.FeedbackControllerCreate.RequestBody) {
    const client = await APIClient();

    return client.FeedbackController_create(null, body);
}

export async function deleteFeedback(id: string) {
    const client = await APIClient();

    return client.UsersController_update(id);
}
