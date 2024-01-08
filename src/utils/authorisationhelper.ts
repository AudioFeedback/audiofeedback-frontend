import * as jose from "jose";

export type roles = "MUZIEKPRODUCER" | "FEEDBACKGEVER" | "ADMIN";

export function getRoles(): Array<roles> | undefined {
    const token = localStorage.getItem("access_token");

    if (!token) {
        return;
    }
    
    // return ["MUZIEKPRODUCER", "FEEDBACKGEVER", "ADMIN"]
    return <Array<roles>>jose.decodeJwt(token).roles ?? undefined;
}
