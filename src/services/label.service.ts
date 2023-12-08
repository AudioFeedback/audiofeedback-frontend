import { APIClient } from ".";

export async function getLabelInvites() {
    const client = await APIClient();

    return client.LabelsController_getInvites();
}
