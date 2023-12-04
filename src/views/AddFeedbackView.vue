<script lang="ts" setup>
import TrackComponent from "@/components/TrackComponent.vue";
import { getProfile } from "@/services/app.service";
import { publishFeedback } from "@/services/feedback.service";
import { getTrackReviewer } from "@/services/tracks.service";
import type { Components } from "@/types/openapi";
import { onBeforeMount, ref } from "vue";
import { AVWaveform } from "vue-audio-visual";
import { useRoute } from "vue-router";

const route = useRoute();
const componentKey = ref(0);
const uploadedfileUrl = ref<string>("");
const trackinfo = ref<Components.Schemas.GetReviewTrackDto>();
const trackversion = ref<Components.Schemas.GetReviewTrackVersionDto>();
const audioPlayer = ref<AVWaveform | null>(null);
const canvasDiv = ref<HTMLElement | null>(null);
const userinfo = ref<Components.Schemas.GetUserDto>();

const submitted = ref<boolean>(false);

const trackComponent = ref();

const forceRerender = () => {
    componentKey.value += 1;
};

const getTrackData = async () => {
    const response = await getTrackReviewer(route.params.id as unknown as number);

    const data = response.data;
    trackinfo.value = data;
    trackversion.value = data.trackversions[0];
    uploadedfileUrl.value = `http://${data.trackversions[0].fullUrl}`;
    forceRerender();
};

const publishFeedbackToArtist = async () => {
    const versionId = trackinfo.value?.trackversions[trackinfo.value?.trackversions.length - 1].id;

    if (!versionId) {
        return;
    }

    await publishFeedback(versionId);
    submitted.value = true;
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
    if (!audioPlayer.value) {
        return;
    }

    const audioElement = audioPlayer.value.$refs.player as HTMLAudioElement;

    audioElement.currentTime = seconds;
    if (!audioElement.paused) {
        audioElement.pause();
    }

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
            :canvas-div="canvasDiv!"
            :version="trackversion?.versionNumber"
            feedback
            @refresh-feedback="getTrackData()"
        ></TrackComponent>

        <div v-if="!trackversion?.feedback[0]?.isPublished" class="w-full flex justify-end">
            <button
                v-if="!submitted"
                class="px-5 py-2.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                type="button"
                @click="publishFeedbackToArtist"
            >
                Submit feedback
            </button>
            <div
                v-if="submitted"
                class="flex flex-row items-center px-5 py-2.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
                <img alt="thumbsup" src="./../assets/up.svg" />
                <p class="ml-2">Feedback Published</p>
            </div>
        </div>

        <div class="relative overflow-x-auto shadow-sm sm:rounded-lg mt-12">
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
                    </tr>
                </tbody>
            </table>
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