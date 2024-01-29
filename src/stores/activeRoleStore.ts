import type { roles } from "@/utils/authorisationhelper";
import { getRoles } from "@/utils/authorisationhelper";
import { ref } from "vue";

export const selectedRole = ref<roles>(getRoles()[0]);
