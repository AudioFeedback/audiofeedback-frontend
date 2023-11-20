import { ref } from "vue";

export const darkmode = ref<boolean>(true);

export function checkMode() {
    const mode = localStorage.getItem("mode");
    darkmode.value = mode === "dark";
}

export function toggleMode() {
    const currentMode = localStorage.getItem("mode");
    if (currentMode === "dark") {
        localStorage.setItem("mode", "light");
        darkmode.value = false;
    } else {
        localStorage.setItem("mode", "dark");
        darkmode.value = true;
    }
}
