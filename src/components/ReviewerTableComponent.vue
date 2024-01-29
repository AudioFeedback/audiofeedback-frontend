<script lang="ts" setup>
import { getTracksReviewer } from "@/services/tracks.service";
import { selectedRole } from "@/stores/activeRoleStore";
import type { Components } from "@/types/openapi";
import type { ToastType } from "@/utils/types";
import { onMounted, ref } from "vue";

const trackData = ref<Array<Components.Schemas.GetTrackWithAuthorDto>>();
const toastType = ref<ToastType>();
const toastMessage = ref<string | null>();

const getTrack = async () => {
    const response = await getTracksReviewer();

    trackData.value = response.data;
};

onMounted(() => getTrack());
</script>

<template>
    <div class="relative overflow-x-auto shadow-sm sm:rounded-lg">
        <table aria-label="Music table" class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    <th v-if="selectedRole === 'FEEDBACKGEVER'" class="px-6 py-3" scope="col">Title</th>
                    <th v-if="selectedRole === 'FEEDBACKGEVER'" class="px-6 py-3" scope="col">
                        <div class="flex items-center">
                            <p>Artist</p>
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
                        <div class="flex items-center">Status</div>
                    </th>
                    <th class="px-6 py-3" scope="col">
                        <span class="sr-only">Review</span>
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
                        {{ track.title }}
                    </th>
                    <td class="px-6 py-4">@{{ track.author.username }}</td>
                    <td class="px-6 py-4">
                        {{ track.genre }}
                    </td>
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
                    <td v-if="track.status[0] == 'REVIEWED'" class="px-6 py-4 text-right">
                        <p class="font-medium text-gray-600 dark:text-gray-500">You have already reviewed this track</p>
                    </td>
                    <td v-if="!(track.status[0] == 'REVIEWED')" class="px-6 py-4 text-right">
                        <router-link
                            :to="`/feedback/${track.id}`"
                            class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                            >Start review
                        </router-link>
                    </td>
                </tr>
            </tbody>
        </table>
        <Toasts v-if="toastType && toastMessage" :message="toastMessage" :type="toastType" />
    </div>
</template>