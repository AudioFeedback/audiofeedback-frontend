<script lang="ts" setup>
import { ref } from "vue";
import { AVWaveform } from "vue-audio-visual";
import Navbar from "./../components/Navbar.vue";
import Table from "./../components/table.vue";

const apiUrl = 'http://localhost:3000/tracks';
let uploadedfileUrl = ref<string>("");
let uploadedfileTitle = ref<string>("");
let uploadedfileGenre = ref<string>("");

const name = ref<string>("");
const genre = ref<string>("");
const audiofile = ref<File | null>(null);
const componentKey = ref(0);

const forceRerender = () => {
  componentKey.value += 1;
};

const handleFileChange = (event: Event) => {
    if(!event || !event.target) return;

    const target = event.target as HTMLInputElement;

  audiofile.value = target.files![0];
};

const submitData = async () => {
  try {
    const body = new FormData();
    body.set("title", name.value)
    body.set("genre", genre.value)
    body.set("file", audiofile.value!)

    const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "accept": "*/*",
                "authorization": `Bearer ${localStorage.getItem('access_token')}`
            }, body: body
        });

    if(!response) {
      return
    }

    console.log('API Response:', response);
    const data = await response.json();
    
    uploadedfileTitle.value = data.title;
    uploadedfileGenre.value = data.genre;
    uploadedfileUrl.value = `http://${data.full_url}`;
    forceRerender();
    
  } catch (error) {
    console.error('API Error:', error);
  }
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
    <main class="p-4 md:ml-64 h-auto pt-20">
        <div v-if="!uploadedfileUrl" class="flex flex-col">
            <h1 class="text-3xl font-bold dark:text-white mb-4">Upload a track</h1>
            <input v-model='name' type='text' placeholder="name" class="mb-2 block w-full rounded-md border-0 py-1.5 px-5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
            <input v-model='genre' type="text" placeholder="genre" class="mb-2 block w-full rounded-md border-0 py-1.5 px-5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
            <!-- <input type="file" v-on:change="handleFileChange" class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"/> -->

            <div class="flex items-center justify-center w-full">
                <label for="dropzone-file" :class="[audiofile ? 'bg-green-600 border-solid border-green-600' : 'bg-grey-50 border-dashed border-gray-300']" class="px-10 flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 rounded-lg cursor-pointer ">
                    <div v-if='!audiofile' class="flex flex-col items-center justify-center pt-5 pb-6 w-[300px]">
                        <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                        </svg>
                        <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload</span> or drag and drop</p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">MP3, AAC, WAV, M4A or FLAC</p>
                    </div>
                    <div v-if='audiofile' class="flex flex-col items-center justify-center pt-5 pb-6 w-[300px]">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 mb-4 text-gray-100">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p class="mb-2 text-sm text-gray-100 dark:text-gray-400"><span class="font-semibold">File uploaded succesfully</span></p>
                        <p class="text-xs text-gray-100 dark:text-gray-400">{{ audiofile.name }}</p>
                    </div>
                    <input id="dropzone-file" type="file" class="hidden"  v-on:change="handleFileChange"/>
                </label>
            </div> 
            <button @click="submitData" class="w-full mt-2 text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2">Submit</button>

            
        </div>
        <div v-if="uploadedfileUrl">
            <h1 class="text-3xl font-bold dark:text-white mb-6">
                {{uploadedfileTitle}} <span class="ml-2 bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">{{uploadedfileGenre}}</span>
            </h1>
            <div class="flex flex-row gap-4 mb-6">
                <button @click="play" class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2">Play</button>
                <button @click="pause" class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2">Pause</button>
                <button @click="seek(0)" class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2">Stop</button>
            </div>

            <AVWaveform
                :key="componentKey"
                ref="audioPlayer"
                :audio-controls="false"
                :canv-height="200"
                :canv-width="800"
                :ftt-size= "2048"
                :noplayed-line-color="'#4F46E5'"
                :played-line-color="'#4f46e5'"
                :playtime="false"
                :playtime-slider-color="'#d5540f'"
                :playtime-slider-width="5"
                cors-anonym
                :src="`${uploadedfileUrl}`"
            ></AVWaveform>
        </div>
    </main>
</template>

<style>
</style>