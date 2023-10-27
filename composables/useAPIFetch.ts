import type { UseFetchOptions } from "nuxt/app";
import { defu } from 'defu';

export default async function useAPIFetch<T>(url: string, options: UseFetchOptions<T> = {}) {
    const { isAuthenticated, setIsAuthenticated } = useIsAuthenticated();
    const { authToken } = useAuthToken();

    // If the user is not authenticated, redirect to a login page
    if (isAuthenticated.value === false) {
        navigateTo('/login');
        // return a dummy response
        return useFetch('/');
    }

    const defaults: UseFetchOptions<T> = {
        baseURL: useRuntimeConfig().public.apiBaseUrl,

        headers: {
            Authorization: `Bearer ${authToken.value}`
        },

        onResponseError({ response }) {
            // If the user is unauthorized, redirect to the login page
            if (response.status == 401) {
                setIsAuthenticated(false);
                navigateTo('/login');
            }
        }
    };

    const params = defu(options, defaults);
    return useFetch(url, params);
}