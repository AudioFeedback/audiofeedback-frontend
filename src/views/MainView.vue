<script lang="ts" setup>
import Navbar from "./../components/Navbar.vue";
import Table from "./../components/table.vue";
import Breadcrumb from "./../components/breadcrums.vue"

var givelayers = [{ 
    name: "something",
    url: "/something"
}]

</script>

<template class="flex flex-row">
    <Navbar />
    <main class="p-4 md:ml-64 h-full pt-10 w-full antialiased bg-gray-50 dark:bg-gray-900">
        <Breadcrumb :layers="givelayers"/>
        <Table />
    </main>
</template>

<style>
</style>