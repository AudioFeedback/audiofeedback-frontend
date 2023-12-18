<script lang="ts" setup>
import Navbar from "@/components/NavBarComponent.vue";
import { getAllLabels, getAssignedReviewers, getAvailableReviewers, inviteNewReviewer } from "@/services/label.service";
import { onMounted, ref } from "vue";

const reviewers = ref<any>([]);

const ShowOverlay = ref<any>();
const ShowAddModal = ref<any>();
const selectedReviewer = ref<any>();
const availableReviewers = ref<any>();
const labelinfo = ref<any>();

const getReviewers = async () => {
    const lables = await getAllLabels();
    if(!lables) return;
    const response = await getAssignedReviewers(lables.data[0].id);
    reviewers.value = response.data;
};

const Showoverlay = (reviewer: any) => {
    if (ShowOverlay.value == reviewer.id) {
        ShowOverlay.value = null;
        return;
    }
    ShowOverlay.value = reviewer.id;
};

const getAvailable = async () => {
    const lables = await getAllLabels();
    if(!lables){
        return;
    } else {
        labelinfo.value = lables.data[0];
        const response = await getAvailableReviewers(labelinfo.value.id);
        availableReviewers.value = response.data;
    }
};

const inviteReviewer = async () => {
    const response = await inviteNewReviewer(labelinfo.value.id, {
        userId: Number(selectedReviewer.value),
    });
    if (!response) {
        return;
    } else {
        ShowAddModal.value = !ShowAddModal.value;
        getReviewers();
        return;
    }
};

onMounted(() => {
    getAvailable();
    getReviewers();
});
</script>

<template class="flex flex-row">
    <Navbar />
    <main class="p-4 sm:ml-64 width-custom pt-10 h-full antialiased bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
        <h2 class="text-4xl mb-4 font-bold dark:text-white">Manage Reviewers</h2>
        <div class="relative shadow-sm sm:rounded-lg">
            <table aria-label="Manage reviewer table" class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th class="px-6 py-3" scope="col">Name</th>
                        <th class="px-6 py-3" scope="col">
                            <div class="flex items-center">Role</div>
                        </th>
                        <th class="px-6 py-3" scope="col">
                            <div class="flex items-center">Status</div>
                        </th>
                        <th class="px-6 py-3" scope="col">
                            <span class="sr-only">Edit</span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="(reviewer, i) in reviewers"
                        :key="i"
                        class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                    >
                        <th
                            class="px-6 py-4 flex flex-row align-center font-medium text-gray-900 whitespace-nowrap dark:text-white"
                            scope="row"
                        >
                            <div
                                class="relative mr-2 inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-primary-600 rounded-full dark:bg-primary-600"
                            >
                                <span class="font-medium text-gray-300 dark:text-gray-300"
                                    >{{ reviewer.firstname.slice(0, 1) }}{{ reviewer.lastname.slice(0, 1) }}</span
                                >
                            </div>
                            <div class="flex flex-col align-left justify-center">
                                <p class="font-semibold">{{ reviewer.firstname }} {{ reviewer.lastname }}</p>
                                <p class="text-gray-600 dark:text-gray-400">@{{ reviewer.username }}</p>
                            </div>
                        </th>
                        <td class="px-6 py-4">
                            {{ reviewer.roles[0] }}
                        </td>
                        <td class="px-6 py-4">
                        <span v-if='reviewer.labelMember[0].status === "ACCEPTED"' class="inline-flex items-center bg-green-100 text-green-800 text-xs px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
                            <span class="w-2 h-2 me-1 bg-green-500 rounded-full"></span>
                            Accepted (Member)
                        </span>
                        <span  v-if='reviewer.labelMember[0].status === "INVITED"' class="inline-flex items-center bg-yellow-100 text-yellow-800 text-xs px-2.5 py-0.5 rounded-full dark:bg-yellow-900 dark:text-yellow-300">
                            <span class="w-2 h-2 me-1 bg-yellow-500 rounded-full"></span>
                            Invite Send
                        </span>
                        <span  v-if='reviewer.labelMember[0].status === "DECLINED"' class="inline-flex items-center bg-red-100 text-red-800 text-xs px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300">
                            <span class="w-2 h-2 me-1 bg-red-500 rounded-full"></span>
                            Declined
                        </span>
                        </td>
                        <td class="px-6 py-4 text-right relative">
                            <button
                                class="inline-flex items-center p-2 text-sm font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                                @click="Showoverlay(reviewer)"
                            >
                                <svg
                                    aria-hidden="true"
                                    class="w-5 h-5"
                                    fill="currentColor"
                                    viewBox="0 0 16 3"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z"
                                    />
                                </svg>
                            </button>
                            <div
                                v-if="ShowOverlay == reviewer.id"
                                class="z-10 absolute right-6 top-50 bg-white divide-y divide-gray-100 rounded-lg shadow-xl border border-1 w-44 dark:bg-gray-700 dark:divide-gray-600"
                            >
                                <ul
                                    aria-labelledby="dropdownMenuIconHorizontalButton"
                                    class="py-2 text-sm text-gray-700 dark:text-gray-200"
                                >
                                    <li>
                                        <a
                                            class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                            href="#"
                                            >Change Role</a
                                        >
                                    </li>
                                </ul>
                                <div class="py-2">
                                    <a
                                        class="block px-4 py-2 text-sm text-red-700 hover:bg-red-100 dark:hover:bg-red-600 dark:text-red-200 dark:hover:text-white"
                                        href="#"
                                        >Delete {{ reviewer.firstname }} {{ reviewer.lastname }}</a
                                    >
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <button
                @click="ShowAddModal = !ShowAddModal"
                class="text-white w-full mt-4 bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 ml-auto font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2">
                Add reviewers
            </button>

            <!-- Show add modal -->
            <div v-if='ShowAddModal' class="h-full w-full flex flex-col items-center justify-center bg-gray-200/[.7] fixed top-0 right-0 left-0 z-50 justify-center items-center md:inset-0 h-[calc(100%-1rem)] max-h-full">
                <div class="relative p-4 w-full max-w-md max-h-full">
                    <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                        <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                                Add reviewer to {{ labelinfo.name  }}
                            </h3>
                            <button type="button" @click="ShowAddModal = !ShowAddModal" class="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="authentication-modal">
                                <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                </svg>
                                <span class="sr-only">Close modal</span>
                            </button>
                        </div>
                        <div class="p-4 md:p-5">
                            <form class="space-y-4" v-on:submit.prevent="inviteReviewer()">
                                <div>
                                    <label for="countries" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select an reviewer</label>
                                    <select v-model='selectedReviewer' v-for="(newreviewer, i) in availableReviewers" :key="i" id="countries" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                        <option selected>Choose a reviewer</option>
                                        <option :value="newreviewer.id">{{ newreviewer.username }}</option>
                                    </select>
                                </div>
                                <button type="submit" class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Add reviewer</button>
                            </form>
                        </div>
                    </div>
                </div>
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