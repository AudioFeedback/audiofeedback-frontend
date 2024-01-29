import * as jose from "jose";

export type roles = "MUZIEKPRODUCER" | "FEEDBACKGEVER" | "ADMIN";

export function getRoles(): Array<roles> {
    const token = localStorage.getItem("access_token");

    if (!token) {
        return [];
    }

    return <Array<roles>>jose.decodeJwt(token).roles;
}
