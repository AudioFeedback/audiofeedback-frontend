<script lang="ts" setup>
import Navbar from "./../components/navbar.vue";
import { ref, onMounted } from "vue";
import {useRoute} from "vue-router";
import { AVWaveform } from "vue-audio-visual";

const route = useRoute();
var apiUrl = 'http://localhost:3000/tracks/' + route.params.id;
const componentKey = ref(0);
const uploadedfileUrl = ref<string>("");
const trackinfo = ref<[any]>();
const trackversion = ref<[any]>();
const audioPlayer = ref<AVWaveform | null>(null);
const canvasDiv = ref<HTMLElement | null>(null);

const forceRerender = () => {
  componentKey.value += 1;
};

const getuserinfo = async () => {
    const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "accept": "*/*",
                "authorization": `Bearer ${localStorage.getItem('access_token')}`
            }
        });

    const data = await response.json();
    console.log('data', data);
    trackinfo.value = data;
    trackversion.value = data.trackversions[0];
    uploadedfileUrl.value = `http://${data.trackversions[0].fullUrl}`;
    forceRerender();
}


const getTimeInMinutesAndSeconds = (timeInSeconds: any): string => {
    if (!timeInSeconds || timeInSeconds <= 0) {
        return "-";
    }

    const mins = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);

    return `${mins}:${seconds < 10 ? '0' : ''}${seconds}`;
};

onMounted(() => {
    getuserinfo()
    window.addEventListener('resize', forceRerender);
}
);

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
</script>

<template class="flex flex-row">
    <Navbar />
    <main class="p-4 sm:ml-64 width-custom pt-10 h-full antialiased bg-gray-50 dark:bg-gray-900 overflow-hidden">
        <nav class=" mb-5 flex px-5 py-3 text-gray-700 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700" aria-label="Breadcrumb">
            <ol class="inline-flex items-center space-x-1 sm:space-x-3">
                <li class="inline-flex items-center">
                <router-link to="/" class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
                    <svg class="w-3 h-3 mr-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
                    </svg>
                    Dashboard
                </router-link>
                </li>
                <li>
                <div class="flex items-center">
                    <svg class="w-3 h-3 mx-1 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
                    </svg>
                    <span class="ml-1 text-sm font-medium text-gray-500 sm:ml-2 dark:text-gray-400">track</span>
                </div>
                </li>
                <li aria-current="page">
                <div class="flex items-center">
                    <svg class="w-3 h-3 mx-1 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
                    </svg>
                    <span class="ml-1 text-sm font-medium text-gray-500 sm:ml-2 dark:text-gray-400">{{trackinfo?.title}}</span>
                </div>
                </li>
            </ol>
        </nav>
        <div class="mb-5 relative">
            <h1 class="text-3xl font-bold dark:text-white mb-6">
                {{trackinfo?.title}} <span class="ml-2 bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">{{trackinfo?.genre}}</span>
            </h1>
            <div class="flex flex-row gap-4 mb-6">
                <button @click="play" class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2">Play</button>
                <button @click="pause" class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2">Pause</button>
                <button @click="seek(0)" class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2">Stop</button>
            </div>
            <div ref="canvasDiv" class="w-full">
                <AVWaveform
                    :key="componentKey"
                    ref="audioPlayer"
                    :audio-controls="false"
                    :canv-height="200"
                    :canv-width="canvasDiv?.clientWidth"
                    :ftt-size= "2048"
                    :noplayed-line-color="'#4F46E5'"
                    :played-line-color="'#4f46e5'"
                    :playtime="false"
                    :playtime-slider-color="'#d5540f'"
                    :playtime-slider-width="5"
                    cors-anonym
                    :src="`${uploadedfileUrl}`"
                ></AVWaveform>
                <div class="relative -top-5">
                    <div class="absolute" :style="{ left: `${(feedback.timestamp*100)-1.5}%` }" v-for="(feedback,i) in trackinfo?.trackversions[0].feedback" :key="i">
                        <div class="relative inline-flex items-center justify-center w-10 h-10 bg-green-200 rounded-full dark:bg-green-600">
                            <span class="font-medium text-gray-600 dark:text-gray-300">{{ feedback.user.firstname.slice(0, 1)}}{{ feedback.user.lastname.slice(0, 1)}}</span>
                            <img class="bottom-0 left-7 absolute w-5 h-5" v-if='feedback.rating == true' src="./../assets/up.svg">
                            <img class="bottom-0 left-7 absolute w-5 h-5" v-if='feedback.rating == false' src="./../assets/down.svg">
                        </div>
                    </div>
                </div>
            </div> 
        </div>

        <div class="relative overflow-x-auto shadow-sm sm:rounded-lg mt-12">
            <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" class="px-6 py-3">
                        User
                        </th>
                        <th scope="col" class="px-6 py-3">
                            <div class="flex items-center">
                                Timestamp
                            </div>
                        </th>
                        <th scope="col" class="px-6 py-3">
                            <div class="flex items-center">
                                Feedback
                            </div>
                        </th>
                        <th scope="col" class="px-6 py-3">
                            <div class="flex items-center">
                                Attachments
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700" v-for="(feedback,i) in trackinfo?.trackversions[0].feedback" :key="i">
                        <th @click='seek(trackinfo?.trackversions[0].duration*feedback.timestamp)' scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white cursor-pointer">
                            @{{feedback.user.username}} ({{ feedback.user.firstname }} {{ feedback.user.lastname }})
                        </th>
                        <td class="px-6 py-4 cursor-pointer" @click='seek(trackinfo?.trackversions[0].duration*feedback.timestamp)'>
                            {{ getTimeInMinutesAndSeconds(trackinfo?.trackversions[0].duration*feedback.timestamp)}}
                        </td>
                        <td class="px-6 py-4">
                            {{ feedback.comment }}
                        </td>
                        <td class="px-6 py-4">
                            file attachment
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </main>
</template>

<style>

.width-custom{
    width: calc(100% - 256px);
    
    @media only screen and (max-width: 640px) {
        width: 100%;
    }
}
</style>