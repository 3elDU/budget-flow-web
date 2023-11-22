import { defu } from 'defu';
import { $fetch } from 'ofetch';

/**
 * @template T
 * @param {string} url 
 * @param {import('nuxt/app').UseFetchOptions<T>} options 
 */
export async function useAPIFetch(url, options = {}) {
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
            Authorization: `Bearer ${authToken.value}`,
            Accept: "application/json"
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

/**
 * @param {string} url
 * @param {import('ofetch').FetchOptions<"json"> | {}} options
 */
export async function useAPIOfetch(url, options = {}) {
    const { isAuthenticated, setIsAuthenticated } = useIsAuthenticated();
    const { authToken } = useAuthToken();

    if (isAuthenticated.value === false) {
        navigateTo('/login');
        return $fetch('/');
    }

    /** @type {import('ofetch').FetchOptions<"json">} */
    const defaults = {
        baseURL: useRuntimeConfig().public.apiBaseUrl,
        headers: {
            Authorization: `Bearer ${authToken.value}`,
            Accept: "application/json"
        },
        onResponseError({ response }) {
            if (response.status == 401) {
                setIsAuthenticated(false);
                navigateTo('/login');
            }
        }
    }

    const params = defu(options, defaults);
    return $fetch(url, params)
}