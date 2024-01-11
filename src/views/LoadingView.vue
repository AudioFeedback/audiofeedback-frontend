<script lang="ts" setup>
import { ref, onMounted } from 'vue';

// Create a reactive variable
const showMessage = ref(false);

// Function to show the message for 5 seconds
const showMessageFor5Seconds = () => {
  showMessage.value = true;
  setTimeout(() => {
    showMessage.value = false;
  }, 5000);
};

// Determine whether to show the message based on a 10% probability
const shouldShowMessage = () => {
  return Math.random() < 0.1;
};

// On component mount, check if the message should be shown
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
</template>