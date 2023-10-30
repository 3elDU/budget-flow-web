export default function () {
    /** @type {Ref<boolean>} */
    const isAuthenticated = useLocalStorage('isAuthenticated', () => false);

    /** @param {boolean} authenticated */
    const setIsAuthenticated = (authenticated) => {
        isAuthenticated.value = authenticated;
    }

    return {
        isAuthenticated,
        setIsAuthenticated
    };
}