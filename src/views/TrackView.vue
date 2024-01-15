<script lang="ts" setup>
import Toasts from "@/components/Toasts-Popup.vue";
import TrackComponent from "@/components/TrackComponent.vue";
import { getProfile } from "@/services/app.service";
import { deleteFeedback } from "@/services/feedback.service";
import { getAssignedReviewers } from "@/services/label.service";
import { addReviewers, getTrack } from "@/services/tracks.service";
import type { Components } from "@/types/openapi";
import { getRoles } from "@/utils/authorisationhelper";
import type { ToastType } from "@/utils/types";
import { initFlowbite } from "flowbite";
import { onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";

const uploadedFileUrl = ref<string>("");
const route = useRoute();
const componentKey = ref(0);
const trackInfo = ref<Components.Schemas.GetTrackDeepDto>();
const canvasDiv = ref<HTMLElement | null>(null);
const activeTab = ref<number>(1);
const showModal = ref<boolean>(false);
const description = ref<string>("");
const audioFile = ref<File | null>(null);
const ShowOverlay = ref<number | null>();
const userinfo = ref<Components.Schemas.GetUserDto>();

const trackComponent = ref();

const trackVersion = ref<number>(0);
const confirmDeletion = ref<boolean>(false);
const deleteID = ref<number>(0);
const feedbackId = ref<number>(0);
const ShowAddModal = ref<boolean>(false);
const reviewersOfLabel = ref<Array<Components.Schemas.GetUserWithLabelMemberDto>>([]);
const selectedReviewer = ref<number>(0);
const toastType = ref<ToastType>();
const toastMessage = ref<string | null>();
const currentLabel = ref<Components.Schemas.GetLabelDto>();

const getCurrentLabel = async () => {
    currentLabel.value = JSON.parse(localStorage.getItem("currentLabel") || "{}");
};

const setTab = (tab: number) => {
    activeTab.value = tab;
};

const forceRerender = () => {
    componentKey.value += 1;
};

const getTrackInfo = async () => {
    const response = await getTrack(route.params.id as unknown as number);

    const data = response.data;
    trackInfo.value = data;

    trackVersion.value = data.trackversions.length - 1;
    uploadedFileUrl.value = `https://${data.trackversions[0].fullUrl}`;
    forceRerender();
};

const getTimeInMinutesAndSeconds = (timeInSeconds: number): string => {
    if (!timeInSeconds || timeInSeconds <= 0) {
        return "-";
    }

    const mins = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);

    return `${mins}:${seconds < 10 ? "0" : ""}${seconds}`;
};

const submitData = async () => {
    const apiUrl = `https://${import.meta.env.VITE_API_URL}/tracks/${trackInfo?.value?.id}`;
    try {
        const body = new FormData();
        body.set("file", audioFile.value!);
        body.set("description", description.value);

        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                accept: "*/*",
                authorization: `Bearer ${localStorage.getItem("access_token")}`
            },
            body: body
        });

        if (!response) {
            return;
        }

        showModal.value = false;
        forceRerender();
        await getTrackInfo();
    } catch (error) {
        console.error("API Error:", error);
    }
};

const handleFileChange = (event: Event) => {
    if (!event || !event.target) {
        return;
    }

    const target = event.target as HTMLInputElement;

    audioFile.value = target.files![0];
};

const Showoverlay = (reviewer: Components.Schemas.GetUserDto) => {
    if (ShowOverlay.value == reviewer.id) {
        ShowOverlay.value = null;
        return;
    }
    ShowOverlay.value = reviewer.id;
};

const getReviewers = async () => {
    if (!currentLabel.value) {
        return;
    }

    const reviewers = await getAssignedReviewers(currentLabel.value.id);
    reviewersOfLabel.value = reviewers.data;
};

const addReviewerToTrack = async () => {
    const response = await addReviewers(String(trackInfo.value?.id), {
        reviewerIds: [selectedReviewer.value]
    });
    if (!response) {
        return;
    } else {
        toastType.value = "succes";
        toastMessage.value = "Reviewer added succesfully";
        setTimeout(() => {
            toastType.value = null;
            toastMessage.value = null;
        }, 5000);
        await getTrackInfo();
        forceRerender();
        ShowAddModal.value = false;
    }
};

onBeforeMount(() => {
    getTrackInfo();
    initFlowbite();
    getUserInfo();
    getCurrentLabel();
    getReviewers();
    window.addEventListener("resize", forceRerender);
});

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

const delFeedback = async (id: number) => {
    const response = await deleteFeedback(id);
    if (!response) {
        return;
    } else {
        toastType.value = "succes";
        toastMessage.value = "Feedback deleted successfully";
        setTimeout(() => {
            toastType.value = null;
            toastMessage.value = null;
        }, 5000);
        await getTrackInfo();
        forceRerender();
        confirmDeletion.value = false;
    }
};

const seek = (seconds: number) => {
    trackComponent.value.seek(seconds);
};

const changeVersion = (version: number) => {
    trackVersion.value = version - 1;
    activeTab.value = 1;
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
                        <span class="ml-1 text-sm font-medium text-gray-500 sm:ml-2 dark:text-gray-400">Track</span>
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
                            trackInfo?.title
                        }}</span>
                    </div>
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
                        <span class="ml-1 text-sm font-medium text-gray-500 sm:ml-2 dark:text-gray-400">
                            Version {{ trackVersion + 1 }}
                        </span>
                    </div>
                </li>
            </ol>
        </nav>
        <div class="border-b border-gray-200 dark:border-gray-700 mb-5">
            <ul class="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
                <li class="me-2">
                    <button
                        :class="{
                            'text-blue-600 border-blue-600 dark:border-blue-500': activeTab === 1,
                            'hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300': activeTab !== 1
                        }"
                        class="inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg"
                        @click="setTab(1)"
                    >
                        <svg
                            aria-hidden="true"
                            class="w-4 h-4 me-2"
                            fill="none"
                            viewBox="0 0 18 16"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M14 11.5V1s3 1 3 4m-7-3H1m9 4H1m4 4H1m13 2.4c0 1.325-1.343 2.4-3 2.4s-3-1.075-3-2.4S9.343 10 11 10s3 1.075 3 2.4Z"
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                            />
                        </svg>
                        Track
                    </button>
                </li>
                <li class="me-2">
                    <button
                        :class="{
                            'text-blue-600 border-blue-600 dark:border-blue-500': activeTab === 2,
                            'hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300': activeTab !== 2
                        }"
                        class="inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg"
                        @click="setTab(2)"
                    >
                        <svg
                            aria-hidden="true"
                            class="w-4 h-4 me-2"
                            fill="none"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M10 6v4l3.276 3.276M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                stroke="currentColor"
                                stroke-linejoin="round"
                                stroke-width="2"
                            />
                        </svg>
                        Version History
                    </button>
                </li>
                <li v-if="getRoles()?.includes('ADMIN')" class="me-2">
                    <button
                        :class="{
                            'text-blue-600 border-blue-600 dark:border-blue-500': activeTab === 3,
                            'hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300': activeTab !== 3
                        }"
                        class="inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg"
                        @click="setTab(3)"
                    >
                        <svg
                            aria-hidden="true"
                            class="w-4 h-4 me-2"
                            fill="none"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M10 6v4l3.276 3.276M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                stroke="currentColor"
                                stroke-linejoin="round"
                                stroke-width="2"
                            />
                        </svg>
                        Manage Reviewers
                    </button>
                </li>
            </ul>
        </div>
        <div v-if="activeTab === 1">
            <TrackComponent
                :id="route.params.id as unknown as number"
                ref="trackComponent"
                :version="trackVersion"
            ></TrackComponent>

            <div class="relative overflow-x-auto shadow-sm sm:rounded-lg mt-12">
                <table aria-label="Feedback table" class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-600 dark:text-gray-400">
                        <tr>
                            <th class="px-6 py-3" scope="col">User</th>
                            <th class="px-6 py-3" scope="col">
                                <div class="flex items-center">Timestamp</div>
                            </th>
                            <th class="px-6 py-3" scope="col">
                                <div class="flex items-center">Feedback</div>
                            </th>
                            <th class="px-6 py-3" scope="col">
                                <div class="flex items-center">Attachments</div>
                            </th>
                        </tr>
                    </thead>
                    <tbody v-for="(feedback, i) in trackInfo?.trackversions[trackVersion].feedback" :key="i">
                        <tr
                            v-if="feedback.timestamp > 0"
                            class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                        >
                            <th
                                class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white cursor-pointer"
                                scope="row"
                                @click="seek(trackInfo!.trackversions[trackVersion].duration * feedback.timestamp)"
                            >
                                @{{ feedback.user.username }} ({{ feedback.user.firstname }}
                                {{ feedback.user.lastname }})
                            </th>
                            <td
                                class="px-6 py-4 cursor-pointer"
                                @click="seek(trackInfo!.trackversions[trackVersion].duration * feedback.timestamp)"
                            >
                                {{
                                    getTimeInMinutesAndSeconds(
                                        trackInfo!.trackversions[trackVersion].duration * feedback.timestamp
                                    )
                                }}
                            </td>
                            <td class="px-6 py-4">
                                {{ feedback.comment }}
                            </td>
                            <td class="px-6 py-4">file attachment</td>
                            <td class="flex items-center px-6 py-4">
                                <button
                                    v-if="getRoles()?.includes('FEEDBACKGEVER') || getRoles()?.includes('ADMIN')"
                                    class="font-medium text-red-600 dark:text-red-500 hover:underline ms-3"
                                    @click="deleteModal(feedback.id)"
                                >
                                    Remove
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
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
                                    @click="delFeedback(deleteID)"
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
            </div>

            <div class="grid grid-cols-4">
                <template v-for="(feedback, i) in trackInfo?.trackversions[trackVersion].feedback" :key="i">
                    <div v-if="feedback.timestamp < 0" class="dark:bg-gray-800 dark:border-gray-700">
                        <div class="flex items-start gap-2.5 pt-6">
                            <div
                                class="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-primary-600 rounded-full dark:bg-primary-600"
                            >
                                <span class="font-semi text-gray-300 dark:text-gray-300">
                                    {{ feedback.user.firstname.slice(0, 1) }}{{ feedback.user.lastname.slice(0, 1) }}
                                </span>
                            </div>
                            <div
                                class="flex flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700"
                            >
                                <div class="flex items-center space-x-2 rtl:space-x-reverse">
                                    <span
                                        class="px-2 py-2 inline-flex items-center mr-3 font-semibold text-sm text-gray-900 dark:text-white"
                                    >
                                        @{{ feedback.user.username }} ({{ feedback.user.firstname }}
                                        {{ feedback.user.lastname }})
                                    </span>
                                </div>
                                <div class="px-2 py-2 text-gray-400">{{ feedback.comment }}></div>
                                <div class="flex flex-row w-full px-2 py-2">
                                    <div class="flex w-full">
                                        <img v-if="feedback.rating" alt="thumbsup" src="./../assets/up.svg" />
                                        <img v-if="!feedback.rating" alt="thumbsdown" src="./../assets/down.svg" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
        </div>

        <div v-if="activeTab === 2">
            <div
                v-for="(track, i) in trackInfo?.trackversions"
                :key="i"
                class="p-5 mb-4 border border-gray-100 rounded-lg bg-gray-50 dark:bg-gray-800 shadow-lg dark:border-gray-700"
            >
                <p class="text-lg font-semibold text-gray-900 dark:text-white">
                    {{
                        new Date(track.createdAt).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric"
                        })
                    }}
                    at {{ new Date(track.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }}
                    <span>- version {{ track.versionNumber }}</span>
                </p>
                <ol class="mt-3 divide-y divider-gray-200 dark:divide-gray-700">
                    <li>
                        <a class="items-center block p-3 sm:flex hover:bg-gray-100 dark:hover:bg-gray-700" href="#">
                            <div
                                class="relative inline-flex me-3 items-center justify-center w-12 h-12 overflow-hidden bg-primary-600 rounded-full dark:bg-primary-600"
                            >
                                <span class="font-medium text-gray-300 dark:text-gray-300"
                                    >{{ userinfo?.firstname.slice(0, 1) }}{{ userinfo?.lastname.slice(0, 1) }}</span
                                >
                            </div>
                            <div
                                class="text-gray-600 w-full dark:text-gray-400 flex flex-row items-center justify-between"
                            >
                                <div>
                                    <div class="text-base font-normal">
                                        <!--TODO: GET ARTIST NAME-->
                                        TO GET ARTIST uploaded track version
                                        {{ track.versionNumber }}
                                    </div>
                                    <div class="text-sm font-normal">{{ track.description }}</div>
                                </div>
                                <button
                                    class="text-white bg-blue-700 mt-2 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                    type="button"
                                    @click="changeVersion(track.versionNumber)"
                                >
                                    View track - version {{ track.versionNumber }}
                                    <svg
                                        aria-hidden="true"
                                        class="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                                        fill="none"
                                        viewBox="0 0 14 10"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M1 5h12m0 0L9 1m4 4L9 9"
                                            stroke="currentColor"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </a>
                    </li>
                    <li v-if="track.feedback.length >= 1">
                        <a class="items-center block p-3 sm:flex hover:bg-gray-100 dark:hover:bg-gray-700" href="#">
                            <div
                                class="relative inline-flex me-3 items-center justify-center w-12 h-12 overflow-hidden bg-primary-600 rounded-full dark:bg-primary-600"
                            >
                                <span class="font-medium text-gray-300 dark:text-gray-300">?</span>
                            </div>
                            <div>
                                <div class="text-base font-normal text-gray-600 dark:text-gray-400">
                                    Feedback has been submitted
                                </div>
                                <span
                                    class="inline-flex items-center text-xs font-normal text-gray-500 dark:text-gray-400"
                                >
                                    <svg
                                        aria-hidden="true"
                                        class="w-2.5 h-2.5 me-2 text-gray-800 dark:text-white"
                                        fill="currentColor"
                                        viewBox="0 0 22 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"
                                        />
                                    </svg>
                                    Kindly view the feedback and submit a new version
                                </span>
                            </div>
                        </a>
                    </li>
                </ol>
            </div>
            <button
                v-if="getRoles()?.includes('MUZIEKPRODUCER')"
                class="text-white w-full bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 ml-auto font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
                @click="showModal = !showModal"
            >
                <!--@click="$router.push(`/track/${trackinfo?.id}/new`)"-->
                New Version
            </button>
            <div
                v-if="showModal"
                class="overflow-y-auto overflow-x-hidden flex flex-row items-center bg-gray-200/[.7] justify-center fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
            >
                <div class="relative p-4 w-full max-w-md max-h-full">
                    <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                        <div
                            class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600"
                        >
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Add new version</h3>
                            <button
                                class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                type="button"
                                @click="showModal = !showModal"
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
                        <form class="p-4 md:p-5" v-on:submit.prevent="submitData()">
                            <textarea
                                id="message"
                                v-model="description"
                                class="block p-2.5 mb-4 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Description"
                                rows="4"
                            ></textarea>
                            <div class="flex items-center justify-center w-full">
                                <label
                                    :class="[
                                        audioFile
                                            ? 'bg-green-600 border-solid border-green-600'
                                            : 'bg-grey-50 border-dashed border-gray-300'
                                    ]"
                                    class="px-10 flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 rounded-lg cursor-pointer"
                                    for="dropzone-file"
                                >
                                    <div
                                        v-if="!audioFile"
                                        class="flex flex-col items-center justify-center pt-5 pb-6 w-[300px]"
                                    >
                                        <svg
                                            aria-hidden="true"
                                            class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                                            fill="none"
                                            viewBox="0 0 20 16"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                                stroke="currentColor"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                            />
                                        </svg>
                                        <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                            <span class="font-semibold">Click to upload</span> or drag and drop
                                        </p>
                                        <p class="text-xs text-gray-500 dark:text-gray-400">
                                            MP3, AAC, WAV, M4A or FLAC
                                        </p>
                                    </div>
                                    <div
                                        v-if="audioFile"
                                        class="flex flex-col items-center justify-center pt-5 pb-6 w-[300px]"
                                    >
                                        <svg
                                            class="w-8 h-8 mb-4 text-gray-100"
                                            fill="none"
                                            stroke="currentColor"
                                            stroke-width="1.5"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                stroke="currentColor"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            />
                                        </svg>
                                        <p class="mb-2 text-sm text-gray-100 dark:text-gray-400">
                                            <span class="font-semibold">File uploaded succesfully</span>
                                        </p>
                                        <p class="text-xs text-gray-100 dark:text-gray-400">{{ audioFile.name }}</p>
                                    </div>
                                    <input id="dropzone-file" class="hidden" type="file" @change="handleFileChange" />
                                </label>
                            </div>
                            <button
                                class="text-white mt-4 w-full inline-flex items-center justify-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                type="submit"
                            >
                                <svg
                                    class="me-1 -ms-1 w-5 h-5"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        clip-rule="evenodd"
                                        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                        fill-rule="evenodd"
                                    ></path>
                                </svg>
                                Add new version
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="activeTab === 3 && getRoles()?.includes('ADMIN')">
            <div class="relative shadow-sm sm:rounded-lg">
                <table
                    v-if="trackInfo && trackInfo.reviewers && trackInfo.reviewers.length > 0"
                    aria-label="Manage reviewer table"
                    class="w-full text-sm text-left text-gray-500 dark:text-gray-400"
                >
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th class="px-6 py-3" scope="col">Name</th>
                            <th class="px-6 py-3" scope="col">
                                <div class="flex items-center">Status</div>
                            </th>
                            <th class="px-6 py-3" scope="col">
                                <div class="flex items-center">Role</div>
                            </th>
                            <th class="px-6 py-3" scope="col">
                                <span class="sr-only">Edit</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="(reviewers, i) in trackInfo?.reviewers"
                            :key="i"
                            class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                        >
                            <th
                                class="px-6 py-4 flex flex-row align-center font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                scope="row"
                            >
                                <div
                                    class="relative mr-2 inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-primary-600 rounded-full dark:bg-primary-600"
                                >
                                    <span class="font-medium text-gray-300 dark:text-gray-300"
                                        >{{ reviewers.firstname.slice(0, 1) }}{{ reviewers.lastname.slice(0, 1) }}</span
                                    >
                                </div>
                                <div class="flex flex-col align-left justify-center">
                                    <p class="font-semibold">{{ reviewers.firstname }} {{ reviewers.lastname }}</p>
                                    <p class="text-gray-600 dark:text-gray-400">@{{ reviewers.username }}</p>
                                </div>
                            </th>
                            <td class="px-6 py-4">
                                <span
                                    class="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-gray-900 dark:text-gray-300"
                                    >Waiting to review</span
                                >
                                <span
                                    class="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300"
                                    >Reviewing</span
                                >
                                <span
                                    class="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300"
                                    >Reviewed</span
                                >
                            </td>
                            <td class="px-6 py-4">
                                {{ reviewers.roles[0] }}
                            </td>
                            <td class="px-6 py-4 text-right relative">
                                <button
                                    class="inline-flex items-center p-2 text-sm font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                                    @click="Showoverlay(reviewers)"
                                >
                                    <svg
                                        aria-hidden="true"
                                        class="w-5 h-5"
                                        fill="currentColor"
                                        viewBox="0 0 16 3"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z"
                                        />
                                    </svg>
                                </button>
                                <div
                                    v-if="ShowOverlay == reviewers.id"
                                    class="z-10 absolute right-6 top-50 bg-white divide-y divide-gray-100 rounded-lg shadow-xl border border-1 w-44 dark:bg-gray-700 dark:divide-gray-600"
                                >
                                    <ul
                                        aria-labelledby="dropdownMenuIconHorizontalButton"
                                        class="py-2 text-sm text-gray-700 dark:text-gray-200"
                                    >
                                        <li>
                                            <a
                                                class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                                href="#"
                                                >Action 1</a
                                            >
                                        </li>
                                        <li>
                                            <a
                                                class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                                href="#"
                                                >Edit Feedback?</a
                                            >
                                        </li>
                                    </ul>
                                    <div class="py-2">
                                        <a
                                            class="block px-4 py-2 text-sm text-red-700 hover:bg-red-100 dark:hover:bg-red-600 dark:text-red-200 dark:hover:text-white"
                                            href="#"
                                        >
                                            <!--TODO: REMOVE REVIEWER FROM TRACK-->
                                            Remove {{ reviewers.firstname }}
                                        </a>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p v-if="trackInfo?.reviewers.length === 0">no reviewers found</p>
                <button
                    class="text-white w-full mt-4 bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 ml-auto font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
                    @click="ShowAddModal = !ShowAddModal"
                >
                    Add reviewers
                </button>
                <!-- Show add modal -->
                <div
                    v-if="ShowAddModal"
                    class="h-full w-full flex flex-col items-center justify-center bg-gray-200/[.7] fixed top-0 right-0 left-0 z-50 justify-center items-center md:inset-0 h-[calc(100%-1rem)] max-h-full"
                >
                    <div class="relative p-4 w-full max-w-md max-h-full">
                        <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                            <div
                                class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600"
                            >
                                <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                                    Add reviewer to {{ trackInfo?.title }}
                                </h3>
                                <button
                                    class="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                    data-modal-hide="authentication-modal"
                                    type="button"
                                    @click="ShowAddModal = !ShowAddModal"
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
                            <div class="p-4 md:p-5">
                                <form class="space-y-4" v-on:submit.prevent="addReviewerToTrack()">
                                    <div>
                                        <label
                                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                            for="reviewers"
                                            >Select an reviewer</label
                                        >
                                        <select
                                            id="reviewers"
                                            v-model="selectedReviewer"
                                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        >
                                            <option selected>Choose a reviewer</option>
                                            <option
                                                v-for="(newreviewer, i) in reviewersOfLabel"
                                                :key="i"
                                                :value="newreviewer.id"
                                            >
                                                {{ newreviewer.firstname }}
                                                {{ newreviewer.lastname }}
                                            </option>
                                        </select>
                                    </div>
                                    <button
                                        class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                        type="submit"
                                    >
                                        Add reviewer
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <Toasts v-if="toastType && toastMessage" :message="toastMessage" :type="toastType" />
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