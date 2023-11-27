<script lang="ts" setup>
import Navbar from "@/components/NavBarComponent.vue";
import { onMounted, ref } from "vue";
import { AVWaveform } from "vue-audio-visual";
import { getReviewers } from "@/services/users.service";
import { useRoute } from "vue-router";

const apiUrl = "http://localhost:3000/tracks";
let uploadedfileUrl = ref<string>("");
let uploadedfileTitle = ref<string>("");
let uploadedfileGenre = ref<string>("");
let uploadedtrackid = ref<number>(0);

const route = useRoute();
const id = route.params.id;
const name = ref<string>("");
const genre = ref<string>("");
const audiofile = ref<File | null>(null);
const labelreviewer = ref<string>("");
const reviewers = ref<any[] | null>(null); //change
const allreviewers = ref<any[]>([]); //change
const possiblereviewers = ref<any[]>([]); //change
const revieweralreadyadded = ref<boolean>(false);
const sendSuccess = ref<boolean>(false);

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

    if(name.value === null || name.value === undefined || name.value === ''){
        const value  = audiofile.value.name;
        name.value = value.substring(0, value.lastIndexOf('.'));
    }
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
        // body.set("description", "Beschrijving van de track");
        body.set("reviewerIds", allreviewers.value.map((reviewer) => reviewer.id).join(','));

        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                accept: "*/*",
                authorization: `Bearer ${localStorage.getItem("access_token")}`
            },
            body: body
        });

        if (!response) {
            sendSuccess.value = false;
            return;
        }

        console.log("API Response:", response);
        const data = await response.json();
        uploadedfileTitle.value = data.title;
        uploadedfileGenre.value = data.genre;
        uploadedtrackid.value = data.id;
        uploadedfileUrl.value = `http://${data.full_url}`;
        sendSuccess.value = true;
        forceRerender();
    } catch (error) {
        console.error("API Error:", error);
        sendSuccess.value = false;
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
            alert("Please enter an label or select a reviewer")
            return;
        }
    }

    if (step == 3){
        if (uploadstatus.value == 3) {
            return;
        }
        submitData();
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
    <main
        class="p-4 sm:ml-64 width-custom pt-10 h-full antialiased bg-gray-50 dark:bg-gray-900 overflow-hidden grid gap-x-4 grid-cols-[auto_1fr]"
    >
        <div class="h-full">
            <div class="flex flex-col w-full">
                <!--v-if="!uploadedfileUrl"-->
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