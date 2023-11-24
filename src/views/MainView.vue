<script lang="ts" setup>
import AdminTableComponent from "@/components/AdminTableComponent.vue";
import Navbar from "@/components/NavBarComponent.vue";
import Table from "@/components/TableComponent.vue";
import { ref } from "vue";

const isAdmin = ref<boolean>();
</script>

<template class="flex flex-row">
    <Navbar />
    <main class="p-4 sm:ml-64 width-custom pt-10 h-full antialiased bg-gray-50 dark:bg-gray-900 overflow-hidden">
        <h2 class="text-4xl mb-4 font-bold dark:text-white">Manage tracks</h2>
        <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="isAdmin" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Is User Admin?</span>
        </label>
        <div v-if="!isAdmin">
            <Table></Table>
        </div>
        <div v-if="isAdmin">
            <AdminTableComponent />
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