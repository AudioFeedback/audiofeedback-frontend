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
