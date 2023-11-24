<script lang="ts" setup>
import { getTracks } from "@/services/tracks.service";
import type { Components } from "@/types/openapi";
import { getRoles } from "@/utils/authorisationhelper";
import { onMounted, ref } from "vue";

const trackdata = ref<Array<Components.Schemas.GetTrackWithAuthorDto>>();

const gettrack = async () => {
    const response = await getTracks();

    trackdata.value = response.data;
};
const roles = getRoles();

onMounted(() => gettrack());
</script>

<template>
    <div class="relative overflow-x-auto shadow-sm sm:rounded-lg">
        <table aria-label="Music table" class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    <th class="px-6 py-3" scope="col">ID</th>
                    <th class="px-6 py-3" scope="col">
                        <div class="flex items-center">
                            Title
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
                    <th v-if="roles?.includes('MUZIEKPRODUCER')" class="px-6 py-3" scope="col">
                        <span class="sr-only">Edit</span>
                    </th>
                    <th v-if="roles?.includes('FEEDBACKGEVER')" class="px-6 py-3" scope="col">
                        <span class="sr-only">Review</span>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="(track, i) in trackdata"
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
                    <td class="px-6 py-4">
                        <span
                            class="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300"
                            >Review in Progress</span
                        >
                    </td>
                    <td v-if="roles?.includes('MUZIEKPRODUCER')" class="px-6 py-4 text-right">
                        <router-link
                            :to="`/track/${track.id}`"
                            class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                            >View
                        </router-link>
                    </td>
                    <td v-if="roles?.includes('FEEDBACKGEVER')" class="px-6 py-4 text-right">
                        <router-link
                            :to="`/feedback/${track.id}`"
                            class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                            >Start review
                        </router-link>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style scoped></style>