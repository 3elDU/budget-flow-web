<template>
    <p class="font-semibold">Dashboard</p>
    <button class="px-3 py-2 text-white font-semibold bg-sky-500 my-3 hover:bg-sky-700 rounded-md" @click="logout">
        Log out
    </button>
    <p class="font-mono whitespace-pre">{{ me }}</p>
</template>

<script setup>
import useAPIFetch from '~/composables/useAPIFetch';

const me = ref({});

const { data: response } = await useAPIFetch('/api/users/me');
me.value = response.value;

function logout() {
    const { setIsAuthenticated } = useIsAuthenticated();
    useAPIFetch('/api/logout', { method: 'POST' });
    setIsAuthenticated(false);
    navigateTo('/login');
}
</script>