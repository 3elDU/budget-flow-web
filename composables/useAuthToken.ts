export default function useAuthToken() {
    const authToken: Ref<string | null> = useLocalStorage('token', () => null);

    const setAuthToken = (token: string | null) => {
        authToken.value = token;
    }

    return {
        authToken,
        setAuthToken
    };
}