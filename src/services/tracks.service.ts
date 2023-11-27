import { APIClient } from ".";

export async function getTracks() {
    const client = await APIClient();

    return client.TracksController_findAll();
}

export async function getTrack(id: number) {
    const client = await APIClient();

    return client.TracksController_findOne(id);
}

export async function getTrackReviews(id: number) {
    const client = await APIClient();

    return client.TracksController_getReviewTrack(id);
}

