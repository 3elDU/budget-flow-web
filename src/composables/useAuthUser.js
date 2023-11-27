import { useSessionStorage } from "@vueuse/core";
import {useAPIOfetch} from './useAPIFetch';

const cached = useSessionStorage('user', { fetched: false })

/**
 * Returns the authenticated user object
 * @returns {Promise<Ref<Object>>} ref
 * @returns {Object} ref.value
 * @returns {number} ref.value.id
 * @returns {string} ref.value.name
 * @returns {string} ref.value.email
 */
export default async function useAuthUser() {
    if (cached.value.fetched === false) {
        cached.value = await useAPIOfetch('/api/users/me');
    }

    return cached;
}