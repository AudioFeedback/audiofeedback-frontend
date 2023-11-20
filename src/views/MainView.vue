<script lang="ts" setup>
import Navbar from "./../components/navbar.vue";
import Table from "./../components/table.vue";

</script>

<template class="flex flex-row">
    <Navbar />
    <main class="p-4 sm:ml-64 width-custom pt-10 h-full antialiased bg-gray-50 dark:bg-gray-900 overflow-hidden">
        <h2 class="text-4xl mb-4 font-bold dark:text-white">Manage tracks</h2>
        <Table />
    </main>
</template>

<style>

.width-custom{
    width: calc(100% - 256px);
    
    @media only screen and (max-width: 640px) {
        width: 100%;
    }
}
</style>