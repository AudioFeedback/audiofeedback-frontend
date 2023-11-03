<script lang="ts" setup>
import { ref } from "vue";
import { AVWaveform } from "vue-audio-visual";

const apiUrl = 'http://localhost:3000/tracks';
let uploadedfileUrl = ref<string>("");

const name = ref<string>("");
const genre = ref<string>("");
const audiofile = ref<File | null>(null);
const componentKey = ref(0);

const forceRerender = () => {
  componentKey.value += 1;
};
// interface InputFileEvent extends Event {
//     target: HTMLInputElement;
// }

const handleFileChange = (event: Event) => {
    if(!event || !event.target) return;

    const target = event.target as HTMLInputElement;

  audiofile.value = target.files![0];
};

//maybe the issue is bc i put it in component and not in route

const submitData = async () => {
  try {
    const body = new FormData();
    body.set("title", name.value)
    body.set("genre", genre.value)
    body.set("file", audiofile.value!)

    const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "accept": "*/*"
            }, body: body
        });

    if(!response) {
      return
    }

    console.log('API Response:', response);
    const data = await response.json();
    
    uploadedfileUrl.value = `http://${data.full_url}`;
    forceRerender();
    // You can handle the response data as needed.
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

<template>
    <p>value: {{ uploadedfileUrl }}</p>
    <div v-if="!uploadedfileUrl">
        <p>audiostreaming:</p>
        <input v-model='name' type='text' placeholder="name" />
        <input v-model='genre' type="text" placeholder="genre" />
        <input type="file" v-on:change="handleFileChange" />
        <button @click="submitData">Submit</button>
    </div>
    <div v-if="uploadedfileUrl">
        <div class="flex flex-row gap-4 mb-12">
            <button @click="play">PLAY</button>
            <button @click="pause">PAUSE</button>
            <button @click="seek(0)">STOP</button>
        </div>

        <AVWaveform
            :key="componentKey"
            ref="audioPlayer"
            :audio-controls="false"
            :canv-height="200"
            :canv-width="800"
            :noplayed-line-color="'#4F46E5'"
            :played-line-color="'#4f46e5'"
            :playtime="false"
            :playtime-slider-color="'#d5540f'"
            :playtime-slider-width="5"
            cors-anonym
            :src="`${uploadedfileUrl}`"
        ></AVWaveform>
    </div>
</template>

<style></style>