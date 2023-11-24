<template>
    <nav v-if="largeScreen"
        class="sticky top-0 z-50 mb-4 drop-shadow-lg bg-secondary flex flex-row px-6 py-2.5 gap-6 font-bold text-xl items-center">
        <div class="flex flex-row">
            <div class="text-2xl">
                Budget-Flow
            </div>
        </div>

        <div class="flex flex-row pl-6 gap-12">
            <NuxtLink v-for="link in links" :to="link.to">
                {{ link.name }}
            </NuxtLink>
        </div>

        <div class="ml-auto flex flex-row pr-6 gap-12 items-center">
            <NuxtLink to="/profile" :title="user.email" class="truncate">{{ user.name }}</NuxtLink>
            <button @click="logout">Log out</button>
        </div>
    </nav>
    <div v-else class="mb-16 relative">
        <div class="fixed top-0 z-30 w-full h-16 bg-primarybg"></div>
        <button @click="toggleSidebar" class="fixed z-50 top-4 left-4">
            <Icon :name="sidebarOpen ? 'mdi:close' : 'mdi:menu'" size="32" />
        </button>
        <Transition name="sidebar">
            <nav v-if="sidebarOpen"
                class="fixed inset-0 z-40 w-full sm:max-w-sm h-full bg-secondary shadow-2xl flex flex-col px-6 pt-4 gap-6 font-bold text-2xl">

                <div class="ml-auto">
                    <NuxtLink to="/profile" :title="user.email" @click="toggleSidebar">
                        {{ user.name }}
                    </NuxtLink>
                </div>

                <NuxtLink v-for="link in links" :to="link.to" @click="toggleSidebar">
                    {{ link.name }}
                </NuxtLink>

                <div class="mt-8 flex flex-col gap-6 justify-left">
                    <button @click="logout">Log out</button>
                </div>
            </nav>
        </Transition>
    </div>
</template>

<script setup>
const user = await useAuthUser();

const links = [
    { "name": "Home", "to": "/dashboard" },
    { "name": "Analytics", "to": "/analytics" },
    { "name": "Income", "to": "/incomes" },
    { "name": "Expense", "to": "/expenses" },
    { "name": "Settings", "to": "/profile" },
]

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