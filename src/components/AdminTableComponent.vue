<script lang="ts" setup>
import { getAllLabels, getAllTracksForLabel } from "@/services/label.service";
import { publishFeedback } from "@/services/tracks.service";
import { getRoles } from "@/utils/authorisationhelper";
import { initFlowbite } from "flowbite";
import { onMounted, ref } from "vue";
import Toasts from "@/components/Toasts-Popup.vue";

const trackdata = ref<Array<any>>();
const ShowOverlay = ref<any>();
const ShowOverlay2 = ref<any>();
const toasttype = ref<any>();
const toastmessage = ref<string | null>();

const gettrack = async () => {
    const lables = await getAllLabels();
    if(!lables) return;
    const response = await getAllTracksForLabel(lables.data[0].id);

    trackdata.value = response.data;
    initFlowbite();
};
const roles = getRoles();

const Showoverlay = (reviewer: any, track: any) => {
    if (ShowOverlay.value == reviewer.id && ShowOverlay2.value == track) {
        ShowOverlay.value = null;
        ShowOverlay2.value = null;
        return;
    }
    ShowOverlay.value = reviewer.id;
    ShowOverlay2.value = track;
};

const sendFeedbackToArtist = async (track: any) => {
    const response = await publishFeedback(track);
    if (response.status == 200) {
        gettrack();
        toasttype.value = "succes";
        toastmessage.value = "Feedback send";
        setTimeout(() => {
            toasttype.value = null;
            toastmessage.value = null;
        }, 5000);
    } else {
        toasttype.value = "error";
        toastmessage.value = "Something went wrong";
        setTimeout(() => {
            toasttype.value = null;
            toastmessage.value = null;
        }, 5000);
    }
};


onMounted(() => {
    gettrack();
});
</script>

<template>
    <div class="relative shadow-sm sm:rounded-lg">
        <table aria-label="Admin table" class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    <th class="px-6 py-3" scope="col">Track</th>
                    <th class="px-6 py-3" scope="col">
                        <div class="flex items-center">Reviewers</div>
                    </th>
                    <th class="px-6 py-3" scope="col">
                        <div class="flex items-center">Genre</div>
                    </th>
                    <th class="px-6 py-3" scope="col">
                        <div class="flex items-center">Status</div>
                    </th>
                    <th class="px-6 py-3" scope="col">
                        <span class="sr-only">Manage</span>
                    </th>
                    <th class="px-6 py-3" scope="col">
                        <span class="sr-only">Send Feedback</span>
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
                        <div class="flex flex-col align-left justify-center">
                            <p class="font-semibold">{{ track.title }}</p>
                            <p class="text-gray-600 dark:text-gray-400">@{{ track.author.username }}</p>
                        </div>
                    </th>
                    <td class="px-6 py-4">
                        <div class="flex -space-x-1 rtl:space-x-reverse relative">
                            <div v-for="(reviewer, i) in track.reviewers" :key="i">
                                <div class="relative">
                                    <div  @click="Showoverlay(reviewer, track.id)" class="relative mr-2 cursor-pointer inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-primary-600 rounded-full dark:bg-primary-600">
                                        <span class="font-medium text-gray-300 dark:text-gray-300">{{ reviewer.firstname.slice(0, 1) }}{{ reviewer.lastname.slice(0, 1) }}</span>
                                    </div>
                                    <span v-if="!reviewer.isReviewed"
                                        class="bottom-0 left-7 absolute w-3.5 h-3.5 bg-red-400 border-2 border-white dark:border-gray-800 rounded-full"
                                    ></span>
                                    <span v-if="reviewer.isReviewed"
                                        class="bottom-0 left-7 absolute w-3.5 h-3.5 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full"
                                    ></span>

                                </div>
                                <div
                                    v-if="ShowOverlay == reviewer.id && ShowOverlay2 == track.id"
                                    :class="{
                                        'bottom-10': ShowOverlay2 > 1,
                                        'top-10': ShowOverlay2 < trackdata!.length - 1
                                    }"
                                    class="absolute z-[990] inline-block w-64 text-sm text-gray-500 bg-white border border-gray-200 rounded-lg shadow-sm dark:text-gray-400 dark:bg-gray-800 dark:border-gray-600"
                                >
                                    <div class="p-3">
                                        <div class="flex items-center justify-between mb-2">
                                            <div class="relative mr-2 inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-primary-600 rounded-full dark:bg-primary-600">
                                                <span class="font-medium text-gray-300 dark:text-gray-300">{{ reviewer.firstname.slice(0, 1) }}{{ reviewer.lastname.slice(0, 1) }}</span>
                                            </div>
                                            <button
                                                class="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-xs px-3 py-1.5 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800"
                                                type="button"
                                            >
                                                Remove as reviewer
                                            </button>
                                        </div>
                                        <p class="text-base font-semibold leading-none text-gray-900 dark:text-white">
                                            {{reviewer.firstname}} {{reviewer.lastname}}
                                        </p>
                                        <p class="text-sm font-normal">@{{reviewer.username}}</p>
                                    </div>
                                </div>
                            </div>
                            <!-- <a
                                class="flex items-center z-10 justify-center w-10 h-10 text-xs font-medium text-white bg-gray-500 border-2 border-white rounded-full hover:bg-gray-600 dark:border-gray-800"
                                href="#"
                                >+</a
                            > -->
                        </div>
                    </td>
                    <td class="px-6 py-4">
                        {{ track.genre }}
                    </td>
                    <td class="px-6 py-4">
                        <span v-if='track.status[0] == "READY_TO_REVIEW"' class="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-gray-900 dark:text-gray-300">Ready to review</span>
                        <span v-if='track.status[0] == "REVIEW_IN_PROGRESS"' class="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">Reviewing</span>
                        <span v-if='track.status[0] == "READY_TO_SEND"' class="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">Ready to Send</span>
                        <span v-if='track.status[0] == "SEND"' class="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">Send</span>
                    </td>
                    <td v-if="roles?.includes('ADMIN')" class="px-6 py-4 text-right">
                        <router-link
                            :to="`/track/${track.id}`"
                            class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                            >Manage
                        </router-link>
                    </td>
                    <td v-if="roles?.includes('ADMIN') && track.status[0] == 'READY_TO_SEND'" @click='sendFeedbackToArtist(track.id)' class="px-6 py-4 text-right cursor-pointer font-medium text-blue-600 dark:text-blue-500 hover:underline">
                        Send Feedback to Artist
                    </td>
                    <td class="px-6 py-4 text-right" v-if='track.status[0] == "REVIEW_IN_PROGRESS" || track.status[0] == "READY_TO_REVIEW"'>Not all reviewers have given feedback</td>
                </tr>
            </tbody>
        </table>
        
        <Toasts v-if="toasttype && toastmessage" :type="toasttype" :message="toastmessage" />
    </div>
</template>