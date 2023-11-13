<script lang="ts" setup>
import { RouterView } from "vue-router";
import Navbar from "./components/Navbar.vue";
</script>

<template>
    <div class="w-full h-full flex justify-center items-center bg-gray-50 dark:bg-gray-900">
        <RouterView />
    </div>
</template>

<style scoped></style>