import { useLocalStorage } from "@vueuse/core";

export default function useAuthToken() {
    /** @type {Ref<string|null>} */
    const authToken = useLocalStorage('token', () => null);

    /** @param {string | null} token */
    const setAuthToken = (token) => {
        authToken.value = token;
    }

    return {
        authToken,
        setAuthToken
    };
}