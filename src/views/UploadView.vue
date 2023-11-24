<script lang="ts" setup>
import Navbar from "@/components/NavBarComponent.vue";
import { ref } from "vue";
import { AVWaveform } from "vue-audio-visual";

const apiUrl = "http://localhost:3000/tracks";
let uploadedfileUrl = ref<string>("");
let uploadedfileTitle = ref<string>("");
let uploadedfileGenre = ref<string>("");

const name = ref<string>("");
const genre = ref<string>("");
const audiofile = ref<File | null>(null);
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
</script>

<template class="flex flex-row justify-between">
    <Navbar />
    <main
        class="p-4 sm:ml-64 width-custom pt-10 h-full antialiased bg-gray-50 dark:bg-gray-900 overflow-hidden grid gap-x-4 grid-cols-[auto_1fr]"
    >
        <ol class="space-y-4 w-72">
            <li class="cursor-pointer" @click="NextStep(0)">
                <div
                    :class="{
                        'text-green-700 border-green-300 bg-green-50 dark:bg-gray-800 dark:border-green-800 dark:text-green-400':
                            uploadstatus > 0,
                        'text-blue-700 bg-blue-100 border-blue-300 dark:bg-gray-800 dark:border-blue-800 dark:text-blue-400':
                            uploadstatus === 0,
                        'text-gray-900 bg-gray-100 border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400':
                            uploadstatus < 0
                    }"
                    class="w-full p-4 border rounded-lg"
                    role="alert"
                >
                    <div class="flex items-center justify-between">
                        <span class="sr-only">Upload track</span>
                        <h3 class="font-medium">1. Upload Track</h3>
                        <svg
                            v-if="uploadstatus > 0"
                            aria-hidden="true"
                            class="w-4 h-4"
                            fill="none"
                            viewBox="0 0 16 12"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M1 5.917 5.724 10.5 15 1.5"
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                            />
                        </svg>
                        <svg
                            v-if="uploadstatus == 0"
                            aria-hidden="true"
                            class="rtl:rotate-180 w-4 h-4"
                            fill="none"
                            viewBox="0 0 14 10"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M1 5h12m0 0L9 1m4 4L9 9"
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                            />
                        </svg>
                    </div>
                </div>
            </li>
            <li class="cursor-pointer" @click="NextStep(1)">
                <div
                    :class="{
                        'text-green-700 border-green-300 bg-green-50 dark:bg-gray-800 dark:border-green-800 dark:text-green-400':
                            uploadstatus > 1,
                        'text-blue-700 bg-blue-100 border-blue-300 dark:bg-gray-800 dark:border-blue-800 dark:text-blue-400':
                            uploadstatus === 1,
                        'text-gray-900 bg-gray-100 border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400':
                            uploadstatus < 1
                    }"
                    class="w-full p-4 border rounded-lg"
                    role="alert"
                >
                    <div class="flex items-center justify-between">
                        <span class="sr-only">Assign Reviewers</span>
                        <h3 class="font-medium">2. Assign Reviewers</h3>
                        <svg
                            v-if="uploadstatus > 1"
                            aria-hidden="true"
                            class="w-4 h-4"
                            fill="none"
                            viewBox="0 0 16 12"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M1 5.917 5.724 10.5 15 1.5"
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                            />
                        </svg>
                        <svg
                            v-if="uploadstatus == 1"
                            aria-hidden="true"
                            class="rtl:rotate-180 w-4 h-4"
                            fill="none"
                            viewBox="0 0 14 10"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M1 5h12m0 0L9 1m4 4L9 9"
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                            />
                        </svg>
                    </div>
                </div>
            </li>
            <li class="cursor-pointer" @click="NextStep(2)">
                <div
                    :class="{
                        'text-green-700 border-green-300 bg-green-50 dark:bg-gray-800 dark:border-green-800 dark:text-green-400':
                            uploadstatus > 2,
                        'text-blue-700 bg-blue-100 border-blue-300 dark:bg-gray-800 dark:border-blue-800 dark:text-blue-400':
                            uploadstatus === 2,
                        'text-gray-900 bg-gray-100 border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400':
                            uploadstatus < 2
                    }"
                    class="w-full p-4 border rounded-lg"
                    role="alert"
                >
                    <div class="flex items-center justify-between">
                        <span class="sr-only">Review</span>
                        <h3 class="font-medium">3. Review</h3>
                        <svg
                            v-if="uploadstatus > 2"
                            aria-hidden="true"
                            class="w-4 h-4"
                            fill="none"
                            viewBox="0 0 16 12"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M1 5.917 5.724 10.5 15 1.5"
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                            />
                        </svg>
                        <svg
                            v-if="uploadstatus == 2"
                            aria-hidden="true"
                            class="rtl:rotate-180 w-4 h-4"
                            fill="none"
                            viewBox="0 0 14 10"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M1 5h12m0 0L9 1m4 4L9 9"
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                            />
                        </svg>
                    </div>
                </div>
            </li>
            <li class="cursor-pointer" @click="NextStep(3)">
                <div
                    :class="{
                        'text-green-700 border-green-300 bg-green-50 dark:bg-gray-800 dark:border-green-800 dark:text-green-400':
                            uploadstatus > 3,
                        'text-blue-700 bg-blue-100 border-blue-300 dark:bg-gray-800 dark:border-blue-800 dark:text-blue-400':
                            uploadstatus === 3,
                        'text-gray-900 bg-gray-100 border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400':
                            uploadstatus < 3
                    }"
                    class="w-full p-4 border rounded-lg"
                    role="alert"
                >
                    <div class="flex items-center justify-between">
                        <span class="sr-only">Confirmation</span>
                        <h3 class="font-medium">4. Confirmation</h3>
                        <svg
                            v-if="uploadstatus > 3"
                            aria-hidden="true"
                            class="w-4 h-4"
                            fill="none"
                            viewBox="0 0 16 12"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M1 5.917 5.724 10.5 15 1.5"
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                            />
                        </svg>
                        <svg
                            v-if="uploadstatus == 3"
                            aria-hidden="true"
                            class="rtl:rotate-180 w-4 h-4"
                            fill="none"
                            viewBox="0 0 14 10"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M1 5h12m0 0L9 1m4 4L9 9"
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                            />
                        </svg>
                    </div>
                </div>
            </li>
        </ol>
        <div>
            <div v-if="uploadstatus === 0" class="flex flex-col w-full">
                <!--v-if="!uploadedfileUrl"-->
                <h1 class="text-3xl font-bold dark:text-white mb-4">Upload a track</h1>
                <input
                    v-model="name"
                    class="mb-2 block w-full rounded-sm border-0 py-1.5 px-5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="name"
                    type="text"
                />
                <input
                    v-model="genre"
                    class="mb-2 block w-full rounded-sm border-0 py-1.5 px-5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="genre"
                    type="text"
                />
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
                    @click="submitData"
                >
                    Submit
                </button>
            </div>
            <div v-if="uploadstatus === 1">
                <p>add reviewers</p>
            </div>
            <div v-if="uploadstatus === 2">
                <p>review information</p>
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

<style scoped>
.width-custom {
    width: calc(100% - 256px);

    @media only screen and (max-width: 640px) {
        width: 100%;
    }
}
</style>