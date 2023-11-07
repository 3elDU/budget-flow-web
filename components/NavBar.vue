<template>
    <nav v-if="largeScreen" class="w-full bg-secondary flex flex-row px-6 py-2.5 gap-6 font-bold text-xl items-center">
        <div class="flex flex-row">
            <div class="text-2xl">
                Budget-Flow
            </div>
        </div>

        <div class="flex flex-row pl-6 gap-12">
            <NuxtLink to="/dashboard">Home</NuxtLink>
            <NuxtLink to="/analytics">Analytics</NuxtLink>
            <NuxtLink to="/incomes">Income</NuxtLink>
            <NuxtLink to="/expenses">Expense</NuxtLink>
            <NuxtLink to="/settings">Settings</NuxtLink>
        </div>

        <div class="ml-auto flex flex-row pr-6 gap-12 items-center">
            <div :title="user.email" class="truncate">{{ user.name }}</div>
            <button @click="logout">Log out</button>
        </div>
    </nav>
    <div v-else class="mb-10">
        <button @click="toggleSidebar" class="absolute z-10 top-4 left-4">
            <Icon :name="sidebarOpen ? 'mdi:close' : 'mdi:menu'" size="32" />
        </button>
        <Transition name="sidebar">
            <nav v-if="sidebarOpen"
                class="fixed w-screen max-w-sm h-screen bg-secondary shadow-2xl flex flex-col px-6 pt-4 gap-6 font-bold text-2xl">

                <div class="ml-auto">
                    <div :title="user.email">{{ user.name }}</div>
                </div>

                <NuxtLink to="/dashboard">Home</NuxtLink>
                <NuxtLink to="/analytics">Analytics</NuxtLink>
                <NuxtLink to="/incomes">Income</NuxtLink>
                <NuxtLink to="/expenses">Expense</NuxtLink>
                <NuxtLink to="/settings">Settings</NuxtLink>

                <div class="mt-8 flex flex-col gap-6 justify-left">
                    <button @click="logout">Log out</button>
                </div>
            </nav>
        </Transition>
    </div>
</template>

<script setup>
const user = await useAuthUser();

const largeScreen = useMediaQuery('(min-width: 1280px)');
const sidebarOpen = ref(false);

const toggleSidebar = useThrottleFn(() => {
    sidebarOpen.value = !sidebarOpen.value;
}, 350);

async function logout() {
    const { setIsAuthenticated } = useIsAuthenticated();
    await useAPIFetch('/api/logout', { method: 'POST' });
    setIsAuthenticated(false);
    await navigateTo('/login');
}
</script>

<style scoped>
.sidebar-enter-active,
.sidebar-leave-active {
    transition: transform 0.3s ease-in-out;
}

.sidebar-enter-from,
.sidebar-leave-to {
    transform: translateX(-100%);
}

.sidebar-enter-to,
.sidebar-leave-from {
    transform: translateX(0);
}
</style>