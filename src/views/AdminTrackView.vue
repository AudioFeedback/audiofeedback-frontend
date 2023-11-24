<script lang="ts" setup>
import Navbar from "@/components/NavBarComponent.vue";
import { getTrack } from "@/services/tracks.service";
import type { Components } from "@/types/openapi";
import { onMounted, ref } from "vue";
import { AVWaveform } from "vue-audio-visual";
import { useRoute } from "vue-router";

const route = useRoute();
const componentKey = ref(0);
const uploadedfileUrl = ref<string>("");
const trackinfo = ref<Components.Schemas.GetTrackDeepDto>();
const audioPlayer = ref<AVWaveform | null>(null);
const canvasDiv = ref<HTMLElement | null>(null);
const activeTab = ref<number>(1);
const ShowOverlay = ref<any>();
const reviewerinfo = ref<Array<any>>();


const trackVersion = ref<number>(0);

const setTab = (tab: number) => {
    activeTab.value = tab;
    forceRerender();
};

const forceRerender = () => {
    componentKey.value += 1;
};

const Showoverlay = (reviewer:any) => {
    if(ShowOverlay.value == reviewer.id){
        ShowOverlay.value = null;
        return;
    }
    ShowOverlay.value = reviewer.id;
    reviewerinfo.value = reviewer;

};

const getTrackInfo = async () => {
    const response = await getTrack(route.params.id as unknown as number);

    const data = response.data;
    console.log("data", data);
    trackinfo.value = data;

    console.log(data);

    trackVersion.value = data.trackversions.length - 1;
    uploadedfileUrl.value = `http://${data.trackversions[0].fullUrl}`;
    forceRerender();
};

const getTimeInMinutesAndSeconds = (timeInSeconds: any): string => {
    if (!timeInSeconds || timeInSeconds <= 0) {
        return "-";
    }

    const mins = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);

    return `${mins}:${seconds < 10 ? "0" : ""}${seconds}`;
};

onMounted(() => {
    getTrackInfo();
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

const changeVersion = (version: number) => {
    trackVersion.value = version - 1;
    activeTab.value = 1;
};
</script>

<template class="flex flex-row">
    <Navbar />
    <main class="p-4 sm:ml-64 width-custom pt-10 h-full antialiased bg-gray-50 dark:bg-gray-900">
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
                        <span class="ml-1 text-sm font-medium text-gray-500 sm:ml-2 dark:text-gray-400">Manage track</span>
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
                <!-- <li>
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
                </li> -->
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
                <li class="me-2">
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
            <div class="mb-5 relative">
                <h1 class="text-3xl font-bold dark:text-white mb-6">
                    {{ trackinfo?.title }}
                    <span
                        class="ml-2 bg-green-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300"
                    >
                        Version {{ trackVersion + 1 }}
                    </span>
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
                </div>
                <div ref="canvasDiv" class="w-full">
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
                            v-for="(feedback, i) in trackinfo?.trackversions[trackVersion].feedback"
                            :key="i"
                            :style="{ left: `${feedback.timestamp * 100 - 1.5}%` }"
                            class="absolute"
                        >
                            <div
                                class="relative inline-flex items-center justify-center w-10 h-10 bg-green-200 rounded-full dark:bg-green-600"
                            >
                                <span class="font-medium text-gray-600 dark:text-gray-300"
                                    >{{ feedback.user.firstname.slice(0, 1)
                                    }}{{ feedback.user.lastname.slice(0, 1) }}</span
                                >
                                <img
                                    v-if="feedback.rating"
                                    alt="thumbsup"
                                    class="bottom-0 left-7 absolute w-5 h-5"
                                    src="./../assets/up.svg"
                                />
                                <img
                                    v-if="!feedback.rating"
                                    alt="thumbsdown"
                                    class="bottom-0 left-7 absolute w-5 h-5"
                                    src="./../assets/down.svg"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="relative overflow-x-auto shadow-sm sm:rounded-lg mt-12">
                <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
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
                    <tbody>
                        <tr
                            v-for="(feedback, i) in trackinfo?.trackversions[trackVersion].feedback"
                            :key="i"
                            class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                        >
                            <th
                                class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white cursor-pointer"
                                scope="row"
                                @click="seek(trackinfo!.trackversions[trackVersion].duration * feedback.timestamp)"
                            >
                                @{{ feedback.user.username }} ({{ feedback.user.firstname }}
                                {{ feedback.user.lastname }})
                            </th>
                            <td
                                class="px-6 py-4 cursor-pointer"
                                @click="seek(trackinfo!.trackversions[trackVersion].duration * feedback.timestamp)"
                            >
                                {{
                                    getTimeInMinutesAndSeconds(
                                        trackinfo!.trackversions[trackVersion].duration * feedback.timestamp
                                    )
                                }}
                            </td>
                            <td class="px-6 py-4">
                                {{ feedback.comment }}
                            </td>
                            <td class="px-6 py-4">file attachment</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div v-if="activeTab === 2">
            <h4 class="text-2xl mb-2 font-bold dark:text-white">Timeline</h4>
            <div v-for="(track, i) in trackinfo?.trackversions" :key="i" class="px-5">
                <ol class="relative border-l border-gray-200 dark:border-gray-700">
                    <li class="mb-10 ml-6">
                        <div
                            class="absolute flex items-center justify-center w-7 h-7 bg-primary-600 rounded-full -left-3 dark:ring-gray-900 dark:bg-primary-900"
                        >
                            <span class="text-sm text-gray-300 dark:text-gray-300">UK</span>
                        </div>
                        <div
                            class="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-700 dark:border-gray-600"
                        >
                            <div class="items-center justify-between mb-3 sm:flex">
                                <time class="mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0">
                                    {{ track.createdAt }}
                                </time>
                                <div class="text-sm font-normal text-gray-500 lex dark:text-gray-300">
                                    Thomas Lean uploaded track version {{ track.versionNumber }}
                                </div>
                            </div>
                            <button
                                class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
                                @click="changeVersion(track.versionNumber)"
                            >
                                View version
                            </button>
                            <div
                                class="p-3 text-xs italic font-normal text-gray-500 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-300"
                            >
                                {{ track.description }}
                            </div>
                        </div>
                    </li>
                </ol>
            </div>
        </div>
        <div v-if="activeTab === 3">
            <div class="relative shadow-sm sm:rounded-lg">
                <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
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
                        <tr v-for="(reviewers, i) in trackinfo.reviewers" :key="i" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <th class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white" scope="row">
                                <div class="flex flex-col align-left justify-center">
                                    <p class="font-semibold">{{ reviewers.firstname }} {{ reviewers.lastname }}</p>
                                    <p class="text-gray-600 dark:text-gray-400">@{{ reviewers.username }}</p>
                                </div>
                            </th>
                            <!-- <td class="px-6 py-4">
                                <div class="flex -space-x-2 rtl:space-x-reverse relative">
                                    <div v-for="(reviewer, i) in reviewers" :key="i">
                                        <img @click="Showoverlay(reviewer, track.id)" class="w-10 h-10 border-2 border-white rounded-full dark:border-gray-800" src="./../assets/profile-picture-5.jpg" alt="">
                                        <div v-if="ShowOverlay == reviewer.id && ShowOverlay2 == track.id" :class="{'bottom-10':ShowOverlay2 > 1, 'top-10': ShowOverlay2 < (trackdata.length-1)}" class="absolute z-[990] inline-block w-64 text-sm text-gray-500 bg-white border border-gray-200 rounded-lg shadow-sm dark:text-gray-400 dark:bg-gray-800 dark:border-gray-600">
                                            <div class="p-3">
                                                <div class="flex items-center justify-between mb-2">
                                                    <img class="w-10 h-10 border-2 border-white rounded-full dark:border-gray-800" src="./../assets/profile-picture-5.jpg" alt="">
                                                    <button type="button" class="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-xs px-3 py-1.5 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800">Remove as reviewer</button>
                                                </div>
                                                <p class="text-base font-semibold leading-none text-gray-900 dark:text-white">Jese Leos</p>
                                                <p class="text-sm font-normal">@username</p>
                                            </div>
                                        </div>
                                    </div>
                                    <a class="flex items-center justify-center w-10 h-10 text-xs font-medium text-white bg-gray-500 border-2 border-white rounded-full hover:bg-gray-600 dark:border-gray-800" href="#">+</a>
                                </div>
                            </td> -->
                            <td class="px-6 py-4">
                                <span class="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-gray-900 dark:text-gray-300">Waiting to review</span>
                                <span class="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">Reviewing</span>
                                <span class="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">Reviewed</span>
                            </td>
                            <td class="px-6 py-4">
                                {{ reviewers.roles[0] }}
                            </td>
                            <td class="px-6 py-4 text-right relative">
                                <button @click="Showoverlay(reviewers)" class="inline-flex items-center p-2 text-sm font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-600"> 
                                    <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 3">
                                        <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z"/>
                                    </svg>
                                </button>
                                <div v-if="ShowOverlay == reviewers.id" 
                                    class="z-10 absolute right-6 top-50 bg-white divide-y divide-gray-100 rounded-lg shadow-xl border border-1 w-44 dark:bg-gray-700 dark:divide-gray-600">
                                    <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownMenuIconHorizontalButton">
                                    <li>
                                        <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Action 1</a>
                                    </li>
                                    <li>
                                        <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Edit Feedback?</a>
                                    </li>
                                    </ul>
                                    <div class="py-2">
                                    <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Remove {{ reviewers.firstname }}</a>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
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