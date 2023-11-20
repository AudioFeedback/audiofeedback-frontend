<script lang="ts" setup>
import { darkmode } from "@/stores/darkmodeStore";
import { RouterView } from "vue-router";
</script>

<template>
    <div
        :class="{ dark: darkmode }"
        class="w-full h-full relative justify-center items-center bg-gray-50 dark:bg-gray-900"
    >
        <RouterView />
    </div>
</template>

<style scoped></style>