import type { Paths } from "@/types/openapi";
import { APIClient } from ".";

export async function createFeedback(body: Paths.FeedbackControllerCreate.RequestBody) {
    const client = await APIClient();

    return client.FeedbackController_create(null, body);
}

export async function publishFeedback(
    trackVersionId: Paths.FeedbackControllerPublishFeedback.Parameters.TrackVersionId
) {
    const client = await APIClient();

    return client.FeedbackController_publishFeedback(trackVersionId);
}

export async function updateFeedback(
    id: Paths.FeedbackControllerUpdate.Parameters.Id,
    body: Paths.FeedbackControllerUpdate.RequestBody
) {
    const client = await APIClient();

    return client.FeedbackController_update(id, body);
}

export async function deleteFeedback(id: Paths.FeedbackControllerRemove.Parameters.Id) {
    const client = await APIClient();

    return client.UsersController_update(id);
}
