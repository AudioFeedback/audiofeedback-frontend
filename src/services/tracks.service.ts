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
