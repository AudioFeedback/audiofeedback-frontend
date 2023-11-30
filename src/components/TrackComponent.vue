<script lang="ts" setup>
import { getProfile } from "@/services/app.service";
import { createFeedback } from "@/services/feedback.service";
import { getTrack, getTrackReviewer } from "@/services/tracks.service";
import type { Components } from "@/types/openapi";
import { onBeforeMount, ref } from "vue";
import { AVWaveform } from "vue-audio-visual";

interface Props {
    id: number;
    canvasDiv: HTMLElement;
    version: number;
    feedback?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    version: 0
});

const componentKey = ref(0);
const uploadedfileUrl = ref<string>("");
const track = ref<Components.Schemas.GetTrackDeepDto | Components.Schemas.GetReviewTrackVersionDto>();
const trackdata = ref<Components.Schemas.GetTrackDeepDto | Components.Schemas.GetReviewTrackDto>();
const audioPlayer = ref<AVWaveform | null>(null);
const trackVersion = ref<number>(0);

const selectedpercentageleft = ref<any>(0);
const selectedTimeStamp = ref<number>(0);
const closepopup = ref<boolean>(false);
const rating = ref<boolean>(true);
const comments = ref<string>("");
const userinfo = ref<Components.Schemas.GetUserDto>();

const forceRerender = () => {
    componentKey.value += 1;
};

const getTrackInfo = async () => {
    if (!props.feedback) {
        const response = await getTrack(props.id);

        const data = response.data;

        track.value = data;
        trackdata.value = data;

        trackVersion.value = props.version;
        uploadedfileUrl.value = `http://${data.trackversions[props.version].fullUrl}`;
        forceRerender();

        console.log(props.version);
    }

    if (props.feedback) {
        const response = await getTrackReviewer(props.id);

        const data = response.data;
        trackdata.value = data;

        trackVersion.value = data.trackversions.length + 1;

        track.value = data.trackversions[0];
        uploadedfileUrl.value = `http://${data.trackversions[0].fullUrl}`;
        forceRerender();
    }
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

onBeforeMount(() => {
    getTrackInfo();
    if (props.feedback) {
        getUserInfo();
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

const emit = defineEmits(["refreshFeedback"]);

const submitFeedback = async () => {
    try {
        if (!track.value) {
            alert("Please fill in all required fields");
            return;
        }

        const response = await createFeedback({
            rating: rating.value,
            comment: comments.value,
            trackVersionId: track.value.id,
            timestamp: selectedTimeStamp.value
        });

        if (!response) {
            return;
        }

        const data = response.data;
        console.log("data", data);
        CloseFeedback();
        rating.value = true;
        comments.value = "";
        selectedTimeStamp.value = 0;

        emit("refreshFeedback");
    } catch (error) {
        console.error("API Error:", error);
    }
};

const CloseFeedback = () => {
    selectedpercentageleft.value = null;
    closepopup.value = true;
    console.log("selectedpercentageleft", selectedpercentageleft.value);
};

const getUserInfo = async () => {
    const response = await getProfile();

    userinfo.value = response.data;
};

defineExpose({ seek });
</script>

<template>
    <div class="mb-5 relative">
        <h1 class="text-3xl font-bold dark:text-white mb-6">
            {{ trackdata?.title }}
            <span
                class="ml-2 bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300"
            >
                Version {{ trackVersion + 1 }}
            </span>
            <span
                class="ml-2 bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300"
                >{{ trackdata?.genre }}</span
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
        <div class="w-full" @click="GetPointerLocation()">
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

            <div v-if="!feedback" class="relative -top-5">
                <div
                    v-for="(trackFeedback, i) in trackdata?.trackversions[trackVersion].feedback"
                    :key="i"
                    :style="{ left: `${trackFeedback.timestamp * 100 - 1.5}%` }"
                    class="absolute"
                >
                    <div
                        class="relative inline-flex items-center cursor-pointer justify-center w-10 h-10 bg-green-200 rounded-full dark:bg-green-600"
                        @click="seek(trackdata!.trackversions[0].duration * trackFeedback.timestamp)"
                    >
                        <span v-if="'user' in trackFeedback" class="font-medium text-gray-600 dark:text-gray-300"
                            >{{ trackFeedback.user.firstname.slice(0, 1)
                            }}{{ trackFeedback.user.lastname.slice(0, 1) }}</span
                        >
                        <img
                            v-if="trackFeedback.rating"
                            alt="thumbsup"
                            class="bottom-0 left-7 absolute w-5 h-5"
                            src="./../assets/up.svg"
                        />
                        <img
                            v-if="!trackFeedback.rating"
                            alt="thumbsdown"
                            class="bottom-0 left-7 absolute w-5 h-5"
                            src="./../assets/down.svg"
                        />
                    </div>
                </div>
            </div>

            <div v-if="feedback" class="relative -top-5">
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
</template>