<script lang="ts" setup>
import { darkmode } from "@/stores/darkmodeStore";
import { RouterView } from "vue-router";
import NavBarComponent from "./components/NavBarComponent.vue";
</script>

<template>
    <div
        :class="{ dark: darkmode }"
        class="w-full h-full relative justify-center items-center bg-gray-50 dark:bg-gray-900"
    >
        <div class="flex flex-row h-full">
            <NavBarComponent v-if="$router?.currentRoute.value.path !== '/login'" />
            <RouterView />
        </div>
    </div>
</template>

<style scoped></style>