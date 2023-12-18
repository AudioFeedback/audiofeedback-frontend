import type { Paths } from "@/types/openapi";
import { APIClient } from ".";

export async function getTracks() {
    const client = await APIClient();

    return client.TracksController_findAll();
}

export async function getTrack(id: Paths.TracksControllerFindOne.Parameters.Id) {
    const client = await APIClient();

    return client.TracksController_findOne(id);
}

export async function getTrackReviewer(id: Paths.TracksControllerGetReviewTrack.Parameters.Id) {
    const client = await APIClient();

    return client.TracksController_getReviewTrack(id);
}

export async function publishFeedback(id: Paths.TracksControllerPublishFeedback.Parameters.TrackversionId) {
    const client = await APIClient();

    return client.TracksController_publishFeedback(id);
}

export async function addReviewers(id: Paths.TracksControllerUpdateReviewers.Parameters.Id, reviewerIds: Paths.TracksControllerUpdateReviewers.RequestBody) {
    const client = await APIClient();

    return client.TracksController_updateReviewers(id, reviewerIds);
}

export async function deleteTrack(id: Paths.TracksControllerRemove.Parameters.Id) {
    const client = await APIClient();

    return client.TracksController_remove(id);
}