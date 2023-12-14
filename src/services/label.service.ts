import type { Paths } from "@/types/openapi";
import { APIClient } from ".";

export async function getLabelInvites() {
    const client = await APIClient();

    return client.LabelsController_getInvites();
}

export async function getAllLabels() {
    const client = await APIClient();

    return client.LabelsController_getLabels();
}

export async function getLabelById(id: Paths.LabelsControllerGetLabelById.Parameters.Id) {
    const client = await APIClient();

    return client.LabelsController_getLabelById(id);
}

export async function getAllTracksForLabel(id: Paths.LabelsControllerGetAllTracksForLabel.Parameters.Id) {
    const client = await APIClient();

    return client.LabelsController_getAllTracksForLabel(id);
}

export async function getLabelTypeahead(query: Paths.LabelsControllerGetLabelTypeahead.Parameters.Query) {
    const client = await APIClient();

    return client.LabelsController_getLabelTypeahead(query);
}

export async function acceptInvite (id: Paths.LabelsControllerAcceptInvite.Parameters.Id, userId: Paths.LabelsControllerAcceptInvite.Parameters.UserId) {
    const client = await APIClient();

    return client.LabelsController_acceptInvite(id, userId);
}

export async function declineInvite (id: Paths.LabelsControllerDeclineInvite.Parameters.Id, userId: Paths.LabelsControllerDeclineInvite.Parameters.UserId) {
    const client = await APIClient();

    return client.LabelsController_declineInvite(id, userId);
}