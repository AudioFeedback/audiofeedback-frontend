import type { roles } from "@/utils/authorisationhelper";
import { getRoles } from "@/utils/authorisationhelper";
import { ref } from "vue";

export const selectedRole = ref<roles | undefined>(undefined);

export function checkRole(): roles | undefined {
    const localStorageRole = <roles>localStorage.getItem("role");

    const userRoles = getRoles();

    if (userRoles.length === 0) {
        return undefined;
    }

    if (userRoles.includes(localStorageRole)) {
        setRole(localStorageRole);
        return selectedRole.value;
    }

    setRole(userRoles[0]);
    return selectedRole.value;
}

export function setRole(role: roles) {
    localStorage.setItem("role", role);
    selectedRole.value = role;
}
