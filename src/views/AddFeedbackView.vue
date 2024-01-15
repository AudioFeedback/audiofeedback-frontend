<script lang="ts" setup>
import TrackComponent from "@/components/TrackComponent.vue";
import { getProfile } from "@/services/app.service";
import { deleteFeedback, publishFeedback, updateFeedback } from "@/services/feedback.service";
import { getTrackReviewer } from "@/services/tracks.service";
import type { Components } from "@/types/openapi";
import { onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const componentKey = ref(0);
const uploadedfileUrl = ref<string>("");
const trackinfo = ref<Components.Schemas.GetReviewTrackDto>();
const trackversion = ref<Components.Schemas.GetReviewTrackVersionDto>();

const canvasDiv = ref<HTMLElement | null>(null);

const rating = ref<boolean>(true);
const comments = ref<string>("");
const userinfo = ref<Components.Schemas.GetUserDto>();
const submitted = ref<boolean>(false);
const showEditModal = ref<boolean>(false);
const feedbackId = ref<number>(0);
const localfeedbackId = ref<number>(0);
const succesmessage = ref<string | null>(null);
const confirmDeletion = ref<boolean>(false);
const deleteID = ref<number>(0);
const publishFeedbackModal = ref<boolean>(false);

const trackComponent = ref();

const forceRerender = () => {
    componentKey.value += 1;
};

const getTrackData = async () => {
    const response = await getTrackReviewer(route.params.id as unknown as number);

    const data = response.data;
    trackinfo.value = data;
    trackversion.value = data.trackversions[0];
    uploadedfileUrl.value = `https://${data.trackversions[0].fullUrl}`;
    forceRerender();
};

const editFeedback = async (localid: number) => {
    if (
        rating.value === trackinfo.value?.trackversions[0].feedback[localid].rating &&
        comments.value === trackinfo.value?.trackversions[0].feedback[localid].comment
    ) {
        alert("Please change something");
        return;
    }
    if (!trackinfo.value?.trackversions[0].feedback[localid].timestamp) {
        return;
    }

    const reponse = await updateFeedback(feedbackId.value, {
        rating: rating.value,
        comment: comments.value,
        timestamp:
            +trackinfo.value?.trackversions[0].feedback[localid].timestamp ??
            trackversion.value?.feedback[localid].timestamp
    });

    if (!reponse) {
        return;
    } else {
        setEditModal(0, 0);
        setToast("Feedback edited succesfully");
        getTrackData();
        forceRerender();
    }
};

const publishFeedbackToArtist = async () => {
    const versionId = trackinfo.value?.trackversions[trackinfo.value?.trackversions.length - 1].id;

    if (!versionId) {
        return;
    }

    await publishFeedback(versionId);
    publishFeedbackModal.value = false;
    submitted.value = true;
};

const setToast = (message: string) => {
    if (message.length > 0) {
        succesmessage.value = message;
        setTimeout(() => {
            succesmessage.value = null;
        }, 3000);
    } else {
        succesmessage.value = null;
    }
};

const setEditModal = (id: number, localid: number) => {
    if (!trackinfo.value?.trackversions[0].feedback[localid]) {
        return;
    }

    if (showEditModal.value === true) {
        showEditModal.value = false;
        feedbackId.value = id;
        localfeedbackId.value = localid;
        rating.value = true;
        comments.value = "";
        return;
    } else {
        showEditModal.value = true;
        feedbackId.value = id;
        localfeedbackId.value = localid;
        rating.value = trackinfo.value?.trackversions[0].feedback[localid].rating;
        comments.value = trackinfo.value?.trackversions[0].feedback[localid].comment;
        return;
    }
};

const deleteModal = (id: number) => {
    if (confirmDeletion.value === true) {
        confirmDeletion.value = false;
        deleteID.value = id;
        return;
    } else {
        confirmDeletion.value = true;
        feedbackId.value = id;
        deleteID.value = id;
        return;
    }
};

const deleteAccount = async (id: number) => {
    const response = await deleteFeedback(id);
    if (!response) {
        return;
    } else {
        setToast("Feedback deleted succesfully");
        getTrackData();
        forceRerender();
    }
};

const getTimeInMinutesAndSeconds = (timeInSeconds: any): string => {
    if (!timeInSeconds || timeInSeconds <= 0) {
        return "-";
    }

    const mins = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);

    return `${mins}:${seconds < 10 ? "0" : ""}${seconds}`;
};

onBeforeMount(() => {
    getTrackData();
    getUserInfo();
    if (!userinfo.value) {
        return;
    }
    window.addEventListener("resize", forceRerender);
});

const seek = (seconds: number) => {
    trackComponent.value.seek(seconds);
};

const getUserInfo = async () => {
    const response = await getProfile();

    userinfo.value = response.data;
};
</script>

<template>
    <main class="p-4 sm:ml-64 width-custom pt-10 h-full antialiased bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
        <nav
            ref="canvasDiv"
            aria-label="Breadcrumb"
            class="mb-5 flex px-5 py-3 text-gray-700 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
        >
            <ol class="inline-flex items-center space-x-1 sm:space-x-3">
                <li class="inline-flex items-center">
                    <router-link
                        class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
                        to="/"
                    >
                        <svg
                            aria-hidden="true"
                            class="w-3 h-3 mr-2.5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"
                            />
                        </svg>
                        Dashboard
                    </router-link>
                </li>
                <li>
                    <div class="flex items-center">
                        <svg
                            aria-hidden="true"
                            class="w-3 h-3 mx-1 text-gray-400"
                            fill="none"
                            viewBox="0 0 6 10"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="m1 9 4-4-4-4"
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                            />
                        </svg>
                        <span class="ml-1 text-sm font-medium text-gray-500 sm:ml-2 dark:text-gray-400"
                            >Review Track</span
                        >
                    </div>
                </li>
                <li aria-current="page">
                    <div class="flex items-center">
                        <svg
                            aria-hidden="true"
                            class="w-3 h-3 mx-1 text-gray-400"
                            fill="none"
                            viewBox="0 0 6 10"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="m1 9 4-4-4-4"
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                            />
                        </svg>
                        <span class="ml-1 text-sm font-medium text-gray-500 sm:ml-2 dark:text-gray-400">{{
                            trackinfo?.title
                        }}</span>
                    </div>
                </li>
            </ol>
        </nav>
        <TrackComponent
            :id="route.params.id as unknown as number"
            ref="trackComponent"
            :version="trackversion?.versionNumber"
            feedback
            @refresh-feedback="getTrackData()"
        ></TrackComponent>

        <div
            class="relative overflow-x-auto shadow-sm sm:rounded-lg mt-12"
        >
            <table aria-label="Feedback table" class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th class="px-6 py-3" scope="col">User</th>
                        <th class="px-6 py-3" scope="col">Rating</th>
                        <th class="px-6 py-3" scope="col">
                            <div class="flex items-center">Timestamp</div>
                        </th>
                        <th class="px-6 py-3" scope="col">
                            <div class="flex items-center">Feedback</div>
                        </th>
                        <th class="px-6 py-3" scope="col">
                            <div class="flex items-center">Attachments</div>
                        </th>
                        <th v-if="!trackversion?.feedback[0]?.isPublished" class="px-6 py-3" scope="col">
                            <div class="flex items-center">Actions</div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="(feedback, i) in trackinfo?.trackversions[0].feedback"
                        :key="i"
                        class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                    >
                        <td class="px-6 py-4">
                            {{ userinfo?.firstname }} {{ userinfo?.lastname }} (@{{ userinfo?.username }})
                        </td>
                        <td class="px-6 py-4">
                            <img v-if="feedback.rating" alt="thumbsup" src="./../assets/up.svg" />
                            <img v-if="!feedback.rating" alt="thumbsdown" src="./../assets/down.svg" />
                        </td>
                        <td class="px-6 py-4" @click="seek(feedback.timestamp * trackinfo!.trackversions[0].duration)">
                            {{ getTimeInMinutesAndSeconds(feedback.timestamp * trackinfo!.trackversions[0].duration) }}
                        </td>
                        <td class="px-6 py-4">
                            {{ feedback.comment }}
                        </td>
                        <td class="px-6 py-4">file attachment</td>
                        <td v-if="!trackversion?.feedback[0]?.isPublished" class="flex items-center px-6 py-4">
                            <button
                                class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                @click="setEditModal(feedback.id, i)"
                            >
                                Edit
                            </button>
                            <button
                                class="font-medium text-red-600 dark:text-red-500 hover:underline ms-3"
                                @click="deleteModal(feedback.id)"
                            >
                                Remove
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <!--edit feedback modal-->
            <div
                v-if="showEditModal"
                class="overflow-y-auto overflow-x-hidden flex flex-row items-center bg-gray-200/[.7] justify-center fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
            >
                <div class="relative p-4 w-full max-w-md max-h-full">
                    <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                        <div
                            class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600"
                        >
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Edit feedback</h3>
                            <button
                                class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                type="button"
                                @click="setEditModal(feedbackId, localfeedbackId)"
                            >
                                <svg
                                    aria-hidden="true"
                                    class="w-3 h-3"
                                    fill="none"
                                    viewBox="0 0 14 14"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                        stroke="currentColor"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                    />
                                </svg>
                                <span class="sr-only">Close modal</span>
                            </button>
                        </div>
                        <form
                            class="p-4 md:p-5"
                            name="feedbackform"
                            v-on:submit.prevent="editFeedback(localfeedbackId)"
                        >
                            <h3 class="mb-2 text-lg font-medium text-gray-900 dark:text-white">
                                Timestamp:
                                {{
                                    getTimeInMinutesAndSeconds(
                                        trackinfo!.trackversions[0].feedback[localfeedbackId].timestamp *
                                            trackinfo!.trackversions[0].duration
                                    )
                                }}
                            </h3>
                            <h3 class="mb-2 text-lg font-medium text-gray-900 dark:text-white">Rating</h3>
                            <ul class="grid w-full gap-6 md:grid-cols-2">
                                <li>
                                    <input
                                        id="rating-postive"
                                        v-model="rating"
                                        :value="true"
                                        checked
                                        class="hidden peer"
                                        name="rating"
                                        required
                                        type="radio"
                                    />
                                    <label
                                        class="inline-flex items-center justify-center w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-600"
                                        for="rating-postive"
                                    >
                                        <img alt="thumbsup" src="./../assets/up.svg" />
                                    </label>
                                </li>
                                <li>
                                    <input
                                        id="hosting-big"
                                        v-model="rating"
                                        :value="false"
                                        class="hidden peer"
                                        name="rating"
                                        required
                                        type="radio"
                                    />
                                    <label
                                        class="inline-flex items-center justify-center w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
                                        for="hosting-big"
                                    >
                                        <img alt="thumbsdown" src="./../assets/down.svg" />
                                    </label>
                                </li>
                            </ul>
                            <h3 class="mb-2 mt-5 text-lg font-medium text-gray-900 dark:text-white">Comments</h3>
                            <div>
                                <div class="mb-6">
                                    <textarea
                                        id="message"
                                        v-model="comments"
                                        class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="Write your thoughts here..."
                                        required
                                        rows="4"
                                    ></textarea>
                                </div>
                            </div>
                            <button
                                class="text-white w-full bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                type="submit"
                            >
                                Edit Feedback
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <!--delete feedback modal-->
            <div
                v-if="confirmDeletion"
                class="overflow-y-auto overflow-x-hidden flex flex-row items-center bg-gray-200/[.7] justify-center fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
            >
                <div class="relative p-4 w-full max-w-md max-h-full">
                    <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                        <button
                            class="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                            type="button"
                            @click="confirmDeletion = !confirmDeletion"
                        >
                            <svg
                                aria-hidden="true"
                                class="w-3 h-3"
                                fill="none"
                                viewBox="0 0 14 14"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                    stroke="currentColor"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                />
                            </svg>
                            <span class="sr-only">Close modal</span>
                        </button>
                        <div class="p-4 md:p-5 text-center">
                            <svg
                                aria-hidden="true"
                                class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
                                fill="none"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                    stroke="currentColor"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                />
                            </svg>
                            <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                Are you sure you want to delete this feedback? This action is permanent
                            </h3>
                            <button
                                class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center me-2"
                                @click="deleteAccount(deleteID)"
                            >
                                Yes, I'm sure
                            </button>
                            <button
                                class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                                @click="confirmDeletion = !confirmDeletion"
                            >
                                No, cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!--publish feedback modal-->
            <div
                v-if="publishFeedbackModal"
                class="overflow-y-auto overflow-x-hidden flex flex-row items-center bg-gray-200/[.7] justify-center fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
            >
                <div class="relative p-4 w-full max-w-md max-h-full">
                    <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                        <button
                            class="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                            type="button"
                            @click="publishFeedbackModal = !publishFeedbackModal"
                        >
                            <svg
                                aria-hidden="true"
                                class="w-3 h-3"
                                fill="none"
                                viewBox="0 0 14 14"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                    stroke="currentColor"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                />
                            </svg>
                            <span class="sr-only">Close modal</span>
                        </button>
                        <div class="p-4 md:p-5 text-center">
                            <svg
                                aria-hidden="true"
                                class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
                                fill="none"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="m7 10 2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                    stroke="currentColor"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                />
                            </svg>
                            <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                Are you sure you want to publish this feedback? After you publish this feedback you
                                can't edit or add feedback.
                            </h3>
                            <button
                                class="text-white bg-primary-600 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:focus:ring-primary-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center me-2"
                                @click="publishFeedbackToArtist()"
                            >
                                Yes, I'm sure
                            </button>
                            <button
                                class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                                @click="publishFeedbackModal = !publishFeedbackModal"
                            >
                                No, cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!--succes toast-->
            <div
                v-if="succesmessage"
                id="toast-success"
                class="fixed top-10 right-4 flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800"
                role="alert"
            >
                <div
                    class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200"
                >
                    <svg
                        aria-hidden="true"
                        class="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"
                        />
                    </svg>
                    <span class="sr-only">Check icon</span>
                </div>
                <div class="ms-3 text-sm font-normal">{{ succesmessage }}</div>
                <button
                    aria-label="Close"
                    class="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
                    data-dismiss-target="#toast-success"
                    type="button"
                    @click="setToast('')"
                >
                    <span class="sr-only">Close</span>
                    <svg
                        aria-hidden="true"
                        class="w-3 h-3"
                        fill="none"
                        viewBox="0 0 14 14"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                        />
                    </svg>
                </button>
            </div>
        </div>
    </main>
</template>

<style scoped>
.width-custom {
    width: calc(100% - 256px);

    @media only screen and (max-width: 640px) {
        width: 100%;
    }
}
</style>