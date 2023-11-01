/**
 * Returns the authenticated user object
 * @returns {Promise<Ref<Object>>} ref
 * @returns {Object} ref.value
 * @returns {number} ref.value.id
 * @returns {string} ref.value.name
 * @returns {string} ref.value.email
 */
export default async function useAuthUser() {
    const { data: user } = await useAPIFetch('/api/users/me', {
        cache: "force-cache",
    });

    return user;
}