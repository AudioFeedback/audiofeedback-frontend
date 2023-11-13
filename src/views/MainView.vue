<script lang="ts" setup>
import Navbar from "./../components/Navbar.vue";
import Table from "./../components/table.vue";
import Breadcrumb from "./../components/breadcrums.vue"


</script>

<template class="flex flex-row">
    <Navbar />
    <main class="p-4 sm:ml-64 h-full pt-10 w-full antialiased bg-gray-50 dark:bg-gray-900">
        <h2 class="text-4xl mb-4 font-bold dark:text-white">Manage tracks</h2>
        <Table />
    </main>
</template>

<style>
</style>