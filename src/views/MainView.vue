<script lang="ts" setup>
import AdminTableComponent from "@/components/AdminTableComponent.vue";
import ProducerTableComponent from "@/components/ProducerTableComponent.vue";
import ReviewerTableComponent from "@/components/ReviewerTableComponent.vue";
import { selectedRole } from "@/stores/activeRoleStore";
</script>

<template>
    <main class="p-4 sm:ml-64 width-custom pt-10 h-full antialiased bg-gray-50 dark:bg-gray-900 overflow-hidden">
        <h2 class="text-4xl mb-4 font-bold dark:text-white">Manage tracks</h2>
        <div v-if="selectedRole === 'MUZIEKPRODUCER'">
            <ProducerTableComponent />
        </div>
        <div v-if="selectedRole === 'FEEDBACKGEVER'">
            <ReviewerTableComponent />
        </div>
        <div v-if="selectedRole === 'ADMIN'">
            <AdminTableComponent />
        </div>
    </main>
</template>

<style scoped>
.width-custom {
    width: calc(100% - 256px);

    @media only screen and (max-width: 640px) {
        width: 100%;
    }
}
</style>