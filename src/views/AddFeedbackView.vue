<script lang="ts" setup>
import Navbar from "@/components/NavBarComponent.vue";
import { getProfile } from "@/services/app.service";
import { createFeedback, publishFeedback } from "@/services/feedback.service";
import { getTrackReviewer } from "@/services/tracks.service";
import type { Components } from "@/types/openapi";
import { onMounted, ref } from "vue";
import { AVWaveform } from "vue-audio-visual";
import { useRoute } from "vue-router";

const route = useRoute();
const componentKey = ref(0);
const uploadedfileUrl = ref<string>("");
const trackinfo = ref<Components.Schemas.GetReviewTrackDto>();
const trackversion = ref<Components.Schemas.GetReviewTrackVersionDto>();
const audioPlayer = ref<AVWaveform | null>(null);
const canvasDiv = ref<HTMLElement | null>(null);
const selectedpercentageleft = ref<any>(0);
const selectedTimeStamp = ref<number>(0);
const closepopup = ref<boolean>(false);
const rating = ref<boolean>(true);
const comments = ref<string>("");
const userinfo = ref<Components.Schemas.GetUserDto>();

const forceRerender = () => {
    componentKey.value += 1;
};

const getTrackData = async () => {
    const response = await getTrackReviewer(route.params.id as unknown as number);

    const data = response.data;
    console.log("data", data);
    trackinfo.value = data;
    trackversion.value = data.trackversions[0];
    uploadedfileUrl.value = `http://${data.trackversions[0].fullUrl}`;
    forceRerender();
};

const submitFeedback = async () => {
    try {
        if (!trackinfo.value || !trackversion.value) {
            return;
        }

        console.log(selectedTimeStamp.value);

        const response = await createFeedback({
            rating: rating.value,
            comment: comments.value,
            trackVersionId: trackversion.value.id,
            timestamp: selectedTimeStamp.value
        });

        if (!response) {
            return;
        }

        const data = response.data;
        console.log("data", data);
        CloseFeedback();
        forceRerender();
        await getTrackData();
    } catch (error) {
        console.error("API Error:", error);
    }
};

const publishFeedbackToArtist = async () => {
    const versionId = trackinfo.value?.trackversions[trackinfo.value?.trackversions.length - 1].id;

    if (!versionId) {
        return;
    }

    await publishFeedback(versionId);
};

const getTimeInMinutesAndSeconds = (timeInSeconds: any): string => {
    if (!timeInSeconds || timeInSeconds <= 0) {
        return "-";
    }

    const mins = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);

    return `${mins}:${seconds < 10 ? "0" : ""}${seconds}`;
};

const GetPointerLocation = () => {
    if (closepopup.value === true) {
        closepopup.value = false;
        return;
    }
    const audioElement = audioPlayer.value.$refs.player as HTMLAudioElement;
    selectedpercentageleft.value = (audioElement.currentTime / audioElement.duration) * 100;
    selectedTimeStamp.value = audioElement.currentTime / audioElement.duration;
};

const CloseFeedback = () => {
    selectedpercentageleft.value = null;
    closepopup.value = true;
    console.log("selectedpercentageleft", selectedpercentageleft.value);
};

onMounted(() => {
    getTrackData();
    getUserInfo();
    if (!userinfo.value) {
        return;
    }
    window.addEventListener("resize", forceRerender);
});

const play = () => {
    if (!audioPlayer.value) {
        return;
    }

    const audioElement = audioPlayer.value.$refs.player as HTMLAudioElement;
    audioElement.play();
};

const pause = () => {
    if (!audioPlayer.value) {
        return;
    }

    const audioElement = audioPlayer.value.$refs.player as HTMLAudioElement;
    audioElement.pause();
};

const seek = (seconds: number) => {
    if (!audioPlayer.value) {
        return;
    }

    const audioElement = audioPlayer.value.$refs.player as HTMLAudioElement;

    audioElement.currentTime = seconds;
    if (!audioElement.paused) {
        audioElement.pause();
    }
};

const getUserInfo = async () => {
    const response = await getProfile();

    userinfo.value = await response.data;
};
</script>

<template class="flex flex-row">
    <Navbar />
    <main class="p-4 sm:ml-64 width-custom pt-10 h-full antialiased bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
        <nav
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
        <div class="mb-5 relative">
            <h1 class="text-3xl font-bold dark:text-white mb-6">
                {{ trackinfo?.title }}
                <span
                    class="ml-2 bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300"
                    >{{ trackinfo?.genre }}</span
                >
            </h1>
            <div class="flex flex-row gap-4 mb-6">
                <button
                    class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
                    @click="play"
                >
                    Play
                </button>
                <button
                    class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
                    @click="pause"
                >
                    Pause
                </button>
                <button
                    class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
                    @click="seek(0)"
                >
                    Stop
                </button>

                <div class="w-full flex justify-end">
                    <button
                        class="px-6 py-3.5 text-base font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        type="button"
                        @click="publishFeedbackToArtist"
                    >
                        Submit feedback
                    </button>
                </div>
            </div>

            <div id="canvasDiv" ref="canvasDiv" class="w-full relative" @click="GetPointerLocation()">
                <AVWaveform
                    :key="componentKey"
                    ref="audioPlayer"
                    :audio-controls="false"
                    :canv-height="200"
                    :canv-width="canvasDiv?.clientWidth"
                    :ftt-size="2048"
                    :noplayed-line-color="'#4F46E5'"
                    :played-line-color="'#4f46e5'"
                    :playtime="false"
                    :playtime-slider-color="'#d5540f'"
                    :playtime-slider-width="5"
                    :src="`${uploadedfileUrl}`"
                    cors-anonym
                ></AVWaveform>
                <div class="relative -top-5">
                    <div
                        v-if="selectedpercentageleft"
                        :style="{ left: `${selectedpercentageleft - 1.5}%` }"
                        class="absolute"
                    >
                        <div
                            class="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-primary-600 rounded-full dark:bg-primary-600"
                        >
                            <span class="font-medium text-gray-300 dark:text-gray-300"
                                >{{ userinfo?.firstname.slice(0, 1) }}{{ userinfo?.lastname.slice(0, 1) }}</span
                            >
                        </div>
                    </div>
                    <div
                        v-if="selectedpercentageleft"
                        :style="{ left: `${selectedpercentageleft + 4}%` }"
                        class="absolute bg-white rounded-lg dark:bg-gray-700 p-4 z-[99] drop-shadow-2xl min-w-[20em]"
                    >
                        <form name="feedbackform" v-on:submit.prevent="submitFeedback()">
                            <div class="flex flex-row align-items justify-between">
                                <h3 class="mb-2 text-lg font-medium text-gray-900 dark:text-white">Rating</h3>
                                <span class="cursor-pointer" @click.prevent="CloseFeedback()">
                                    <svg
                                        aria-hidden="true"
                                        class="w-4 h-4 text-gray-800 dark:text-white"
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
                                </span>
                            </div>
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
                                        class="inline-flex items-center justify-center w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
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
                                Add Feedback
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <div class="relative overflow-x-auto shadow-sm sm:rounded-lg mt-12">
            <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th class="px-6 py-3" scope="col">
                            <div class="flex items-center">Timestamp</div>
                        </th>
                        <th class="px-6 py-3" scope="col">
                            <div class="flex items-center">Feedback</div>
                        </th>
                        <th class="px-6 py-3" scope="col">
                            <div class="flex items-center">Rating</div>
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
                        <td class="px-6 py-4" @click="seek(feedback.timestamp * trackinfo!.trackversions[0].duration)">
                            {{ getTimeInMinutesAndSeconds(feedback.timestamp * trackinfo!.trackversions[0].duration) }}
                        </td>
                        <td class="px-6 py-4">
                            {{ feedback.comment }}
                        </td>
                        <td class="px-6 py-4">
                            <img v-if="feedback.rating" alt="thumbsup" src="./../assets/up.svg" />
                            <img v-if="!feedback.rating" alt="thumbsdown" src="./../assets/down.svg" />
                        </td>
                        <td class="px-6 py-4">file attachment</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </main>
</template>

<style>
.width-custom {
    width: calc(100% - 256px);

    @media only screen and (max-width: 640px) {
        width: 100%;
    }
}
</style>