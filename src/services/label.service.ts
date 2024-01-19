import type { Paths } from "@/types/openapi";
import { APIClient } from ".";

export async function getLabelInvites() {
    const client = await APIClient();

    return client.LabelsController_getInvites();
}

export async function getLabelAssigned() {
    const client = await APIClient();

    return client.LabelsController_getAssignedLabels();
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

export async function acceptInvite (id: Paths.LabelsControllerAcceptInvite.Parameters.Id, userId: Paths.LabelsControllerAcceptInvite.RequestBody) {
    const client = await APIClient();

    return client.LabelsController_acceptInvite(id, userId);
}

export async function declineInvite (id: Paths.LabelsControllerDeclineInvite.Parameters.Id, userId: Paths.LabelsControllerDeclineInvite.RequestBody) {
    const client = await APIClient();

    return client.LabelsController_declineInvite(id, userId);
}

export async function getAvailableReviewers(id: Paths.LabelsControllerGetAvailableReviewers.Parameters.Id) {
    const client = await APIClient();

    return client.LabelsController_getAvailableReviewers(id);
}

export async function inviteNewReviewer(id: Paths.LabelsControllerInviteUser.Parameters.Id, userId:  Paths.LabelsControllerInviteUser.RequestBody) {
    const client = await APIClient();

    return client.LabelsController_inviteUser(id, userId);
}

export async function getAssignedReviewers(id: Paths.LabelsControllerGetAssignedReviewers.Parameters.Id) {
    const client = await APIClient();

    return client.LabelsController_getAssignedReviewers(id);
}

export async function removeReviewer(id: Paths.LabelsControllerRemoveReviewers.Parameters.Id, reviewerId: Paths.LabelsControllerRemoveReviewers.Parameters.ReviewerId, labelMemberId: Paths.LabelsControllerRemoveReviewers.Parameters.LabelMemberId) {
    const client = await APIClient();

    return client.LabelsController_removeReviewers({id: id, reviewerId: reviewerId, labelMemberId: labelMemberId});
}