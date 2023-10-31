<script lang="ts" setup>
import { ref } from "vue";
import { AVWaveform } from "vue-audio-visual";

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
    <div>
        <div class="flex flex-row gap-4 mb-12">
            <button @click="play">PLAY</button>
            <button @click="pause">PAUSE</button>
            <button @click="seek(0)">STOP</button>
        </div>

        <AVWaveform
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
            src="http://localhost:3000/tracks/audio/33a6b441-f2e0-4672-8010-95848491a56a.mp3"
        ></AVWaveform>
    </div>
</template>

<style></style>