export default function () {
    const isAuthenticated: Ref<boolean> = useLocalStorage('isAuthenticated', () => false);

    const setIsAuthenticated = (authenticated: boolean) => {
        isAuthenticated.value = authenticated;
    }

    return {
        isAuthenticated,
        setIsAuthenticated
    };
}