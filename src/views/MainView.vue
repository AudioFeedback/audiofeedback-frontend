<script lang="ts" setup>
import AdminTableComponent from "@/components/AdminTableComponent.vue";
import TableComponent from "@/components/TableComponent.vue";
import { getRoles } from "@/utils/authorisationhelper";
import { ref, onMounted } from "vue";

const showMessage = ref(false);

const showMessageFor5Seconds = () => {
  showMessage.value = true;
  setTimeout(() => {
    showMessage.value = false;
  }, 5000);
};

const shouldShowMessage = () => {
  return Math.random() < 0.001;
};

onMounted(() => {
  if (shouldShowMessage()) {
    showMessageFor5Seconds();
  }
});
</script>

<template>
    <template v-if="showMessage">
        <iframe style="width: 100%; height: 100%; z-index: 100000; position: fixed; left: 0; top: 0;" src="https://www.youtube.com/embed/QwLvrnlfdNo?si=tY0Aw1u44AMml6PN&amp;controls=0&autoplay=1&mute=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
    </template>
    <main class="p-4 sm:ml-64 width-custom pt-10 h-full antialiased bg-gray-50 dark:bg-gray-900 overflow-hidden">
        <LoadingView></LoadingView>
        <h2 class="text-4xl mb-4 font-bold dark:text-white">Manage tracks</h2>
        <div v-if="getRoles()?.includes('MUZIEKPRODUCER') || getRoles()?.includes('FEEDBACKGEVER')">
            <TableComponent></TableComponent>
        </div>
        <div v-if="getRoles()?.includes('ADMIN')">
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