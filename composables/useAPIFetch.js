import { defu } from 'defu';

/**
 * @template T
 * @param {string} url 
 * @param {import('nuxt/app').UseFetchOptions<T>} options 
 */
export default async function useAPIFetch(url, options = {}) {
    const { isAuthenticated, setIsAuthenticated } = useIsAuthenticated();
    const { authToken } = useAuthToken();

    // If the user is not authenticated, redirect to a login page
    if (isAuthenticated.value === false) {
        navigateTo('/login');
        // return a dummy response
        return useFetch('/');
    }

    const defaults = {
        baseURL: useRuntimeConfig().public.apiBaseUrl,

        headers: {
            Authorization: `Bearer ${authToken.value}`
        },

        onRequestError() {
            navigateTo('/api_down');
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