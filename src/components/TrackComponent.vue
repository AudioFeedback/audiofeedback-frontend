<script lang="ts" setup>
import "1llest-waveform-vue/lib/style.css";
import { getProfile } from "@/services/app.service";
import { createFeedback, publishFeedback } from "@/services/feedback.service";
import { getTrack, getTrackReviewer } from "@/services/tracks.service";
import type { Components } from "@/types/openapi";
import { onKeyStroke } from "@vueuse/core";
import { onBeforeMount, onMounted, reactive, ref, watchEffect } from "vue";
import { IllestWaveform, type IllestWaveformProps } from "../utils/1llest-waveform";

interface Props {
    id: number;
    version: number;
    feedback?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    version: 0
});

const componentKey = ref(0);
const uploadedFileUrl = ref<string>("");
const track = ref<Components.Schemas.GetTrackVersionDeepDto | Components.Schemas.GetReviewTrackVersionDto>();
const trackData = ref<Components.Schemas.GetTrackDeepDto | Components.Schemas.GetReviewTrackDto>();

const trackVersion = ref<number>(0);

const selectedPercentageLeft = ref<number | null>(0);
const selectedTimeStamp = ref<number>(0);
const closePopup = ref<boolean>(false);
const rating = ref<boolean>(true);
const comments = ref<string>("");
const userInfo = ref<Components.Schemas.GetUserDto>();

const submitted = ref<boolean>(false);
const showSubmitButton = ref<boolean>(false);

const trackDuration = ref<number>(-1);

const keyPressesDisabled = ref<boolean>(false);

const waveOptions = reactive<IllestWaveformProps>({
    url: uploadedFileUrl.value,
    lineColor: "#1C64F2",
    maskColor: "#1849a8",
    cursorWidth: 3,
    cursorColor: "#ff6200",
    skeleton: true,
    skeletonColor: "000000",
    fade: false
});

const waveformRef = ref<typeof IllestWaveform | null>(null);

onMounted(() => {
    getCurrentTime();
});

const init = ref(false);
const fetched = ref(false);
const playing = ref(false);
const ready = ref(false);
const currentTime = ref(-1);
const durationTime = ref(-1);

const initHandler = (v: boolean) => {
    init.value = v;
};

const fetchedHandler = (v: boolean) => {
    fetched.value = v;
};

const readyHandler = (v: boolean) => {
    ready.value = v;
    getDuration();
};

const getCurrentTime = () => {
    watchEffect(() => {
        currentTime.value = waveformRef.value!.getCurrentTime();
    });
};

const getDuration = () => {
    durationTime.value = waveformRef.value!.getDuration();
};

const checkSubmitted = async () => {
    const response = await getTrackReviewer(props.id);

    const data = response.data;

    if (!data) {
        return console.log("no trackdata found");
    }

    if (data.trackversions[0].feedback.length > 0 && !data.trackversions[0].feedback[0].isPublished) {
        return (showSubmitButton.value = true);
    }

    return (showSubmitButton.value = false);
};

const forceRerender = () => {
    componentKey.value += 1;
};

function debounce<T extends (...args: Parameters<T>) => void>(this: ThisParameterType<T>, fn: T, delay = 300) {
    let timer: ReturnType<typeof setTimeout> | undefined;
    return (...args: Parameters<T>) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
}

const getTrackInfo = async () => {
    if (!props.feedback) {
        const response = await getTrack(props.id);

        const data = response.data;

        track.value = data.trackversions[0];
        trackData.value = data;

        trackVersion.value = props.version + 1;
        uploadedFileUrl.value = `https://${data.trackversions[props.version].fullUrl}`;
        waveOptions.url = uploadedFileUrl.value;
        trackDuration.value = track.value.duration;
        
        forceRerender();
    }

    if (props.feedback) {
        const response = await getTrackReviewer(props.id);

        const data = response.data;
        trackData.value = data;

        trackVersion.value = data.trackversions[0].versionNumber;

        track.value = data.trackversions[0];

        uploadedFileUrl.value = `https://${data.trackversions[0].fullUrl}`;
        waveOptions.url = uploadedFileUrl.value;
        trackDuration.value = track.value.duration;

        await checkSubmitted();
        forceRerender();
    }
};

const GetPointerLocation = () => {
    if (closePopup.value === true) {
        closePopup.value = false;
        return;
    }

    if (!trackData.value || !trackDuration.value) {
        return;
    }

    selectedPercentageLeft.value = (currentTime.value / trackDuration.value) * 100;
    selectedTimeStamp.value = currentTime.value / trackDuration.value;
    toggleKeyPresses(true);
};

onBeforeMount(() => {
    getTrackInfo();
    if (props.feedback) {
        getUserInfo();
    }
    window.addEventListener("resize", debounce(forceRerender));
});

const playpause = () => {
    if (!waveformRef.value) {
        return;
    }
    if (!playing.value) {
        waveformRef.value.play();
        return;
    }

    if (playing.value) {
        waveformRef.value.pause();
        return;
    }
};

const toggleKeyPresses = (val?: boolean) => {
    keyPressesDisabled.value = val ?? !keyPressesDisabled.value;
};

onKeyStroke(" ", (e) => {
    if (keyPressesDisabled.value && props.feedback) {
        return;
    }

    e.preventDefault();

    playpause();
});

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
        await checkSubmitted();
    } catch (error) {
        console.error("API Error:", error);
    }
};

const CloseFeedback = () => {
    selectedPercentageLeft.value = null;
    closePopup.value = true;
    console.log("selectedpercentageleft", selectedPercentageLeft.value);
    toggleKeyPresses();
};

const getUserInfo = async () => {
    const response = await getProfile();

    userInfo.value = response.data;
};

const publishFeedbackToArtist = async () => {
    const versionId = track.value?.id;

    if (!versionId) {
        return;
    }

    await publishFeedback(versionId);
    submitted.value = true;
};

const seek = (to: number) => {
    if (!waveformRef.value) {
        return;
    }

    waveformRef.value.seek(to);
    playing.value = false;
};

defineExpose({ seek, toggleKeyPresses });
</script>

<template>
    <div class="mb-5 relative">
        <h1 class="text-3xl font-bold dark:text-white mb-6">
            {{ trackData?.title }}
            <span
                class="ml-2 bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300"
            >
                Version {{ trackVersion }}
            </span>
            <span
                class="ml-2 bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300"
                >{{ trackData?.genre }}</span
            >
        </h1>
        <div class="flex flex-row gap-2 mb-6">
            <button
                class="text-white p-1 bg-gray-700 hover:bg-gray-500 dark:bg-gray-700 dark:hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
                @click="playpause"
            >
                <svg
                    v-if="!playing"
                    aria-hidden="true"
                    class="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 14 16"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M0 .984v14.032a1 1 0 0 0 1.506.845l12.006-7.016a.974.974 0 0 0 0-1.69L1.506.139A1 1 0 0 0 0 .984Z"
                    />
                </svg>
                <svg
                    v-if="playing"
                    aria-hidden="true"
                    class="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 10 16"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        clip-rule="evenodd"
                        d="M0 .8C0 .358.32 0 .714 0h1.429c.394 0 .714.358.714.8v14.4c0 .442-.32.8-.714.8H.714a.678.678 0 0 1-.505-.234A.851.851 0 0 1 0 15.2V.8Zm7.143 0c0-.442.32-.8.714-.8h1.429c.19 0 .37.084.505.234.134.15.209.354.209.566v14.4c0 .442-.32.8-.714.8H7.857c-.394 0-.714-.358-.714-.8V.8Z"
                        fill-rule="evenodd"
                    />
                </svg>
            </button>
            <button
                class="text-white p-1 bg-gray-700 hover:bg-gray-500 dark:bg-gray-700 dark:hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
                @click="seek(0)"
            >
                <svg
                    aria-hidden="true"
                    class="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <rect height="100" width="100"></rect>
                </svg>
            </button>

            <div v-if="feedback && showSubmitButton" class="w-full flex justify-end">
                <button
                    v-if="!submitted"
                    class="px-5 py-2.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    type="button"
                    @click="publishFeedbackToArtist"
                >
                    Submit feedback
                </button>
                <div
                    v-if="submitted"
                    class="flex flex-row items-center px-5 py-2.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                    <img alt="thumbsup" src="./../assets/up.svg" />
                    <p class="ml-2">Feedback Published</p>
                </div>
            </div>
        </div>
        <div class="w-full h-48" @click="GetPointerLocation()">
            <IllestWaveform
                :key="componentKey"
                ref="waveformRef"
                v-bind="waveOptions"
                @click="GetPointerLocation()"
                @on-init="initHandler"
                @on-fetched="fetchedHandler"
                @on-ready="readyHandler"
                @on-play="(v: boolean) => (playing = v)"
                @on-pause="(v: boolean) => (playing = v)"
            />

            <div v-if="!feedback" class="relative -top-5">
                <div
                    v-for="(trackFeedback, i) in trackData?.trackversions[trackVersion - 1].feedback"
                    :key="i"
                    :style="{ left: `${trackFeedback.timestamp * 100 - 1.5}%` }"
                    class="absolute"
                >
                    <div
                        class="relative inline-flex items-center cursor-pointer justify-center w-10 h-10 bg-green-200 rounded-full dark:bg-green-600"
                        @click="seek(trackData!.trackversions[0].duration * trackFeedback.timestamp)"
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
                    v-if="selectedPercentageLeft"
                    :style="{ left: `${selectedPercentageLeft - 1.5}%` }"
                    class="absolute"
                >
                    <div
                        class="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-primary-600 rounded-full dark:bg-primary-600"
                    >
                        <span class="font-medium text-gray-300 dark:text-gray-300"
                            >{{ userInfo?.firstname.slice(0, 1) }}{{ userInfo?.lastname.slice(0, 1) }}</span
                        >
                    </div>
                </div>
                <div
                    v-if="selectedPercentageLeft"
                    :style="{
                        position: 'absolute',
                        [selectedPercentageLeft < 80 ? 'left' : 'right']: `${
                            selectedPercentageLeft < 80 ? selectedPercentageLeft + 4 : 100 - selectedPercentageLeft + 4
                        }%`
                    }"
                    class="bg-white rounded-lg dark:bg-gray-700 p-4 z-[99] drop-shadow-2xl min-w-[20em]"
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