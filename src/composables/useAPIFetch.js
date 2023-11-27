import { defu } from 'defu';
import { ofetch } from 'ofetch';
import { createFetch, useFetch } from '@vueuse/core';
import useAuthToken from './useAuthToken';
import useIsAuthenticated from './useIsAuthenticated';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

async function _fetch() {
    
}

/**
 * @param {string} url 
 * @param {import('ofetch').FetchOptions<'json'> | undefined} options 
 */
export function useAPIFetch(url, options) {
    const { authToken } = useAuthToken();
    const { setIsAuthenticated } = useIsAuthenticated();

    const pending = ref(true);
    /** @type {import('vue').Ref<any>} */
    const data = ref(null);
    /** @type {import('vue').Ref<any>} */
    const error = ref(null);

    /** @type {import('ofetch').FetchOptions<"json">} */
    let defaults = {
        baseURL: import.meta.env.VITE_API_ROOT,
        responseType: 'json',
        headers: {
            Authorization: `Bearer ${authToken.value}`,
            Accept: "application/json"
        },
        onRequestError(error) {
            pending.value = false;
            error.value = error;
        },
        onResponseError(context) {
            if (context.response.status === 401) {
                setIsAuthenticated(false);
                window.location.replace('/login');
            }

            pending.value = false;
            error.value = context.error;
        },
    }

    let finalOptions = defu(options, defaults);
    ofetch(url, finalOptions)
        .then((response) => {
            pending.value = false;
            data.value = response;
        });

    /** @param {import('ofetch').FetchOptions<'json'> | undefined} options */
    const refresh = (options) => {
        pending.value = true;
        ofetch(url, defu(options, defaults))
            .then((response) => {
                pending.value = false;
                error.value = null;
                data.value = response;
            })
    }

    return {
        pending,
        data,
        error,
        refresh,
    }
}

/**
 * @param {string} url
 * @param {import('ofetch').FetchOptions<T> | {}} options
 */
export async function useAPIOfetch(url, options = {}) {
    const { isAuthenticated, setIsAuthenticated } = useIsAuthenticated();
    const { authToken } = useAuthToken();

    if (isAuthenticated.value === false) {
        await useRouter().push('login');
        return undefined;
    }

    const defaults = {
        baseURL: import.meta.env.VITE_API_ROOT,
        headers: {
            Authorization: `Bearer ${authToken.value}`,
            Accept: "application/json"
        },
        async onResponseError({ response }) {
            if (response.status == 401) {
                setIsAuthenticated(false);
                await useRouter().push('login');
            }
        }
    }

    const params = defu(options, defaults);
    return ofetch(url, params);
}