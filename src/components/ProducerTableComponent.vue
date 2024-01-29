<script lang="ts" setup>
import { deleteTrack, getTracksProducer } from "@/services/tracks.service";
import type { Components } from "@/types/openapi";
import type { ToastType } from "@/utils/types";
import { onMounted, ref } from "vue";

const trackData = ref<Array<Components.Schemas.GetTrackWithAuthorDto>>();
const toastType = ref<ToastType>();
const toastMessage = ref<string | null>();
const confirmDeletion = ref<boolean>(false);
const delTrackId = ref<number>(0);

const getTrack = async () => {
    const response = await getTracksProducer();

    trackData.value = response.data;
};

const delTrack = async (id: number) => {
    const response = await deleteTrack(id.toString());
    if (!response) {
        return;
    }

    toastType.value = "succes";
    toastMessage.value = "Track deleted";
    setTimeout(() => {
        toastType.value = null;
        toastMessage.value = null;
    }, 5000);
    confirmDeletion.value = false;

    getTrack();
};

onMounted(() => getTrack());
</script>

<template>
    <div class="relative overflow-x-auto shadow-sm sm:rounded-lg">
        <table aria-label="Music table" class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    <th class="px-6 py-3" scope="col">ID</th>

                    <th class="px-6 py-3" scope="col">
                        <div class="flex items-center">
                            <p>Title</p>
                            <a href="#">
                                <svg
                                    aria-hidden="true"
                                    class="w-3 h-3 ml-1.5"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z"
                                    />
                                </svg>
                            </a>
                        </div>
                    </th>
                    <th class="px-6 py-3" scope="col">
                        <div class="flex items-center">Genre</div>
                    </th>
                    <th class="px-6 py-3" scope="col">
                        <div class="flex items-center">Label</div>
                    </th>
                    <th class="px-6 py-3" scope="col">
                        <div class="flex items-center">Status</div>
                    </th>
                    <th class="px-6 py-3" scope="col">
                        <span class="sr-only">Edit</span>
                    </th>
                    <th class="px-6 py-3" scope="col">
                        <span class="sr-only">Delete Track</span>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="(track, i) in trackData"
                    :key="i"
                    class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                >
                    <th class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white" scope="row">
                        {{ track.id }}
                    </th>
                    <td class="px-6 py-4">
                        {{ track.title }}
                    </td>
                    <td class="px-6 py-4">
                        {{ track.genre }}
                    </td>
                    <td v-if="track.label" class="px-6 py-4 flex flex-row gap-2 items-center">
                        <img
                            :src="track.label.profilePicture"
                            alt="label profile picture"
                            class="h-8 w-auto rounded-full"
                        />
                        {{ track.label.name }}
                    </td>
                    <td v-if="!track.label" class="px-6 py-4 flex flex-row gap-2 items-center">None</td>
                    <td class="px-6 py-4">
                        <span
                            v-if="track.status[0] == 'READY_TO_REVIEW'"
                            class="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-gray-900 dark:text-gray-300"
                            >Ready to review</span
                        >
                        <span
                            v-if="track.status[0] == 'PENDING_REVIEW'"
                            class="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300"
                            >Pending Review</span
                        >
                        <span
                            v-if="track.status[0] == 'REVIEWED'"
                            class="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300"
                            >Reviewed</span
                        >
                    </td>
                    <td class="px-6 py-4 text-right">
                        <router-link
                            :to="`/track/${track.id}`"
                            class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                            >View
                        </router-link>
                    </td>
                    <td
                        class="px-6 py-4 text-right font-medium cursor-pointer text-red-600 dark:text-red-500 hover:underline ms-3"
                        @click="
                            confirmDeletion = !confirmDeletion;
                            delTrackId = track.id;
                        "
                    >
                        Delete track
                    </td>
                    <div
                        v-if="confirmDeletion"
                        class="overflow-y-auto overflow-x-hidden flex flex-row items-center bg-gray-200/[.1] justify-center fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
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
                                        @click="delTrack(+delTrackId)"
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
                </tr>
            </tbody>
        </table>
        <Toasts v-if="toastType && toastMessage" :message="toastMessage" :type="toastType" />
    </div>
</template>