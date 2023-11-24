<script lang="ts" setup>
import Navbar from "@/components/NavBarComponent.vue";
import { onMounted, ref } from "vue";
import { AVWaveform } from "vue-audio-visual";
import { getReviewers } from "@/services/users.service";

const apiUrl = "http://localhost:3000/tracks";
let uploadedfileUrl = ref<string>("");
let uploadedfileTitle = ref<string>("");
let uploadedfileGenre = ref<string>("");

const name = ref<string>("");
const genre = ref<string>("");
const audiofile = ref<File | null>(null);
const labelreviewer = ref<string>("");
const reviewers = ref<any[] | null>(null); //change
const allreviewers = ref<any[]>([]); //change
const possiblereviewers = ref<any[]>([]); //change
const revieweralreadyadded = ref<boolean>(false);

const componentKey = ref(0);
const uploadstatus = ref<number>(0);

const forceRerender = () => {
    componentKey.value += 1;
};

const handleFileChange = (event: Event) => {
    if (!event || !event.target) {
        return;
    }

    const target = event.target as HTMLInputElement;

    audiofile.value = target.files![0];
};

const AddReviewer = () => {
    for(let i = 0; i < allreviewers.value.length; i++) {
        if (allreviewers.value[i] == reviewers.value) {
            revieweralreadyadded.value = true;
            return;
        }
    }
    revieweralreadyadded.value = false;
    allreviewers.value.push(reviewers.value);
};

const RemoveReviewer = (reviewer: string) => {
    const index = allreviewers.value.indexOf(reviewer);
    if (index > -1) {
        allreviewers.value.splice(index, 1);
    }
};

const getReviewer = async () => {
    const response = await getReviewers();
    possiblereviewers.value = response.data;
    forceRerender();
};

const submitData = async () => {
    try {
        const body = new FormData();
        body.set("title", name.value);
        body.set("genre", genre.value);
        body.set("file", audiofile.value!);
        body.set("description", "Beschrijving van de track");

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

        console.log("API Response:", response);
        const data = await response.json();

        uploadedfileTitle.value = data.title;
        uploadedfileGenre.value = data.genre;
        uploadedfileUrl.value = `http://${data.full_url}`;
        forceRerender();
    } catch (error) {
        console.error("API Error:", error);
    }
};

const NextStep = (step: number) => {
    if(step == 1){
        if (name.value == "" || genre.value == "" || audiofile.value == null) {
            alert("Please fill in all fields")
            return;
        }
    }

    if(step == 2){

        if (labelreviewer.value == "" && allreviewers.value.length == 0) {
            alert("Please fill in all fields")
            return;
        }
    }
    uploadstatus.value = step;
};

const audioPlayer = ref<AVWaveform | null>(null);

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

onMounted(() => {
    getReviewer();
});

</script>

<template class="flex flex-row justify-between">
    <Navbar />
    <main class="p-4 sm:ml-64 width-custom pt-10 h-full antialiased bg-gray-50 dark:bg-gray-900 overflow-hidden grid gap-x-4 grid-cols-[auto_1fr]">
        <ol class="space-y-4 w-72">
            <li class="cursor-pointer">
                <div :class="{
                    'text-green-700 border-green-300 bg-green-50 dark:bg-gray-800 dark:border-green-800 dark:text-green-400': uploadstatus > 0,
                    'text-blue-700 bg-blue-100 border-blue-300 dark:bg-gray-800 dark:border-blue-800 dark:text-blue-400': uploadstatus === 0,
                    'text-gray-900 bg-gray-100 border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400': uploadstatus < 0
                    }" 
                    class="w-full p-4 border rounded-lg " role="alert">
                    <div class="flex items-center justify-between">
                        <span class="sr-only">Upload track</span>
                        <h3 class="font-medium">1. Upload Track</h3>
                        <svg v-if="uploadstatus > 0" class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5.917 5.724 10.5 15 1.5"/>
                        </svg>
                        <svg v-if="uploadstatus == 0" class="rtl:rotate-180 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                        </svg>
                    </div>
                </div>
            </li>
            <li class="cursor-pointer">
                <div :class="{
                    'text-green-700 border-green-300 bg-green-50 dark:bg-gray-800 dark:border-green-800 dark:text-green-400': uploadstatus > 1,
                    'text-blue-700 bg-blue-100 border-blue-300 dark:bg-gray-800 dark:border-blue-800 dark:text-blue-400': uploadstatus === 1,
                    'text-gray-900 bg-gray-100 border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400': uploadstatus < 1
                    }" 
                    class="w-full p-4 border rounded-lg " role="alert">
                    <div class="flex items-center justify-between">
                        <span class="sr-only">Assign Reviewers</span>
                        <h3 class="font-medium">2. Assign Reviewers</h3>
                        <svg v-if="uploadstatus > 1" class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5.917 5.724 10.5 15 1.5"/>
                        </svg>
                        <svg v-if="uploadstatus == 1" class="rtl:rotate-180 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                        </svg>
                    </div>
                </div>
            </li>
            <li class="cursor-pointer">
                <div :class="{
                    'text-green-700 border-green-300 bg-green-50 dark:bg-gray-800 dark:border-green-800 dark:text-green-400': uploadstatus > 2,
                    'text-blue-700 bg-blue-100 border-blue-300 dark:bg-gray-800 dark:border-blue-800 dark:text-blue-400': uploadstatus === 2,
                    'text-gray-900 bg-gray-100 border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400': uploadstatus < 2
                    }" 
                    class="w-full p-4 border rounded-lg " role="alert">
                    <div class="flex items-center justify-between">
                        <span class="sr-only">Review</span>
                        <h3 class="font-medium">3. Review</h3>
                        <svg v-if="uploadstatus > 2" class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5.917 5.724 10.5 15 1.5"/>
                        </svg>
                        <svg v-if="uploadstatus == 2" class="rtl:rotate-180 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                        </svg>
                    </div>
                </div>
            </li>
            <li @click="NextStep(3)" class="cursor-pointer">
                <div :class="{
                    'text-green-700 border-green-300 bg-green-50 dark:bg-gray-800 dark:border-green-800 dark:text-green-400': uploadstatus > 3,
                    'text-blue-700 bg-blue-100 border-blue-300 dark:bg-gray-800 dark:border-blue-800 dark:text-blue-400': uploadstatus === 3,
                    'text-gray-900 bg-gray-100 border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400': uploadstatus < 3
                    }" 
                    class="w-full p-4 border rounded-lg " role="alert">
                    <div class="flex items-center justify-between">
                        <span class="sr-only">Confirmation</span>
                        <h3 class="font-medium">4. Confirmation</h3>
                        <svg v-if="uploadstatus > 3" class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5.917 5.724 10.5 15 1.5"/>
                        </svg>
                        <svg v-if="uploadstatus == 3" class="rtl:rotate-180 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                        </svg>
                    </div>
                </div>
            </li>

        </ol>
        <div>
            <div v-if="uploadstatus === 0" class="flex flex-col w-full"> <!--v-if="!uploadedfileUrl"-->
                <h1 class="text-3xl font-bold dark:text-white mb-4">Upload a track</h1>
                <input v-model="name" type="text" class="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Name" required>
                <input v-model="genre" type="text" class="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Genre" required>
                <div class="flex items-center justify-center w-full">
                    <label
                        :class="[
                            audiofile
                                ? 'bg-green-600 border-solid border-green-600'
                                : 'bg-grey-50 border-dashed border-gray-300'
                        ]"
                        class="px-10 flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 rounded-lg cursor-pointer"
                        for="dropzone-file"
                    >
                        <div v-if="!audiofile" class="flex flex-col items-center justify-center pt-5 pb-6 w-[300px]">
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
                            <p class="text-xs text-gray-500 dark:text-gray-400">MP3, AAC, WAV, M4A or FLAC</p>
                        </div>
                        <div v-if="audiofile" class="flex flex-col items-center justify-center pt-5 pb-6 w-[300px]">
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
                            <p class="text-xs text-gray-100 dark:text-gray-400">{{ audiofile.name }}</p>
                        </div>
                        <input id="dropzone-file" class="hidden" type="file" @change="handleFileChange" />
                    </label>
                </div>
                <button
                    class="w-full mt-2 text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
                    @click="NextStep(1)">
                    Submit
                </button>
            </div>
            <div class="relative h-full" v-if="uploadstatus === 1">
                <h1 class="text-3xl font-bold dark:text-white mb-4">Assign reviewers to "{{ name }}".</h1>
                <div>
                    <label for="label-reviewer" class="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">Add email of label</label>
                    <input type="email" v-model="labelreviewer" id="label-reviewer" aria-describedby="helper-text-explanation" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@muzieklabel.com">
                    <p id="label-reviewer-explanation" class="mt-2 text-sm text-gray-500 dark:text-gray-400">The label will assign individual reviewers, and will send the track back once all reviewers have given feedback.</p>
                </div>
                <hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700">
                <div>
                    <label class="block mb-2 text-sm font-semibold text-gray-900 dark:text-white inline-flex items-center" for="reviewers"> Add Reviewers</label>
                    <p v-if='labelreviewer.length > 0' id="label-reviewer-explanation" class="mt-2 text-sm text-gray-500 dark:text-gray-400">You cannot add individual reviewers when assigning an label.</p>
                    <select v-model="reviewers" v-if="labelreviewer.length <= 0" id="reviewers" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        <option  v-for="(reviewer, i) in possiblereviewers" :key="i" :value="reviewer" class="cursor-pointer">@{{reviewer.username}}</option>
                    </select>
                    <button v-if="labelreviewer.length <= 0" @click="AddReviewer()" :disabled="labelreviewer.length > 0" :class="{'text-white bg-gray-800 hover:bg-gray-900': labelreviewer.length < 0 || labelreviewer.length === 0, 'bg-gray-400 text-gray-900 dark:text-white':labelreviewer.length > 0 }" class="w-full mt-2 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2">Add reviewer</button>
                    <div v-if="labelreviewer.length <= 0 && revieweralreadyadded">
                        <p class="bg-red-100 !mt-2 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">Reviewer already added</p>
                    </div>
                    <div v-if="labelreviewer.length <= 0">
                        <ul v-for="(reviewer, i) in allreviewers" :key="i" class="w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <li class="py-3 sm:py-4">
                                <div class="flex items-center space-x-3 rtl:space-x-reverse">
                                    <div class="flex-shrink-0">
                                        <div class="relative inline-flex text-sm items-center justify-center w-8 h-8 overflow-hidden bg-primary-600 rounded-full dark:bg-primary-600">
                                            <span class="font-medium text-gray-300 dark:text-gray-300">{{ reviewer.firstname.slice(0, 1) }}{{ reviewer.lastname.slice(0, 1) }}</span>
                                        </div>
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <p class="text-sm font-semibold text-gray-900 truncate dark:text-white">{{reviewer.firstname}} {{ reviewer.lastname }}</p>
                                        <p class="text-sm text-gray-500 truncate dark:text-gray-400">@{{ reviewer.username }}</p>
                                    </div>
                                    <div @click="RemoveReviewer(reviewer)" class="flex flex-row items-center justify-center p-2 px-4 dark:text-white hover:bg-primary-500 hover:text-white rounded-md cursor-pointer">
                                        <svg class="w-4 h-4 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m13 7-6 6m0-6 6 6m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                                        </svg>
                                        <p>remove reviewer</p>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <button :class="{
                    'bg-gray-400 hover:bg-gray-500': labelreviewer === '' || allreviewers.length === 0,
                    'bg-gray-800 hover:bg-gray-900': labelreviewer !== '' || allreviewers.length > 0
                    }" @click="NextStep(2)" class=" absolute bottom-0 right-0 w-full mt-2 text-white focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2">Next Step: Review</button>
            </div>
            <div v-if="uploadstatus === 2">
                <h1 class="text-3xl font-bold dark:text-white mb-4">Review information</h1>
                <p>general information</p>
                <ul>
                    <li>{{ name }}</li>
                    <li>{{ genre }}</li>
                </ul>

                <p>reviewers</p>
                <ul>
                    <li>{{ labelreviewer }}</li>
                </ul>
                <ul v-for="(reviewer, i) in allreviewers" :key="i">
                    <li>{{ reviewer }}</li>
                </ul>
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
                <div>
                    <AVWaveform
                        :key="componentKey"
                        ref="audioPlayer"
                        :audio-controls="false"
                        :canv-height="200"
                        :canv-width="800"
                        :ftt-size="2048"
                        :noplayed-line-color="'#4F46E5'"
                        :played-line-color="'#4f46e5'"
                        :playtime="false"
                        :playtime-slider-color="'#d5540f'"
                        :playtime-slider-width="5"
                        :src="`${uploadedfileUrl}`"
                        cors-anonym
                    ></AVWaveform>
                </div>

            </div>
            <div v-if="uploadstatus === 3">
                <p>Track has been send</p>
            </div>
            <!-- <div v-if="uploadedfileUrl">
            <h1 class="text-3xl font-bold dark:text-white mb-6">
                {{ uploadedfileTitle }}
                <span
                    class="ml-2 bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300"
                    >{{ uploadedfileGenre }}</span
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

            <AVWaveform
                :key="componentKey"
                ref="audioPlayer"
                :audio-controls="false"
                :canv-height="200"
                :canv-width="800"
                :ftt-size="2048"
                :noplayed-line-color="'#4F46E5'"
                :played-line-color="'#4f46e5'"
                :playtime="false"
                :playtime-slider-color="'#d5540f'"
                :playtime-slider-width="5"
                :src="`${uploadedfileUrl}`"
                cors-anonym
            ></AVWaveform>
            </div> -->
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