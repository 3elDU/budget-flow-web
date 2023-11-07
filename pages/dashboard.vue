<template>
    <title>Dashboard</title>

    <div class="w-screen h-screen flex flex-col">
        <!-- Navbar -->
        <nav class="w-screen bg-secondary flex flex-row px-6 py-2.5 gap-6 font-bold text-xl items-center">
            <div class="flex flex-row">
                <div class="text-2xl">
                    Budget-Flow
                </div>
            </div>

            <div class="flex flex-row px-6 gap-12">
                <NuxtLink to="/dashboard">Home</NuxtLink>
                <NuxtLink to="/analytics">Analytics</NuxtLink>
                <NuxtLink to="/incomes">Income</NuxtLink>
                <NuxtLink to="/expenses">Expense</NuxtLink>
                <NuxtLink to="/settings">Settings</NuxtLink>
            </div>

            <div class="ml-auto flex flex-row px-6 gap-12 items-center">
                <div :title="user.email">{{ user.name }}</div>
                <button @click="logout">Log out</button>
            </div>
        </nav>

        <!-- Main section -->
        <div v-if="error !== null" class="grow flex flex-col gap-4 justify-center items-center">
            <p class="text-3xl font-bold">Failed to load budgets</p>
            <button class="btn-default" style="padding-left: 1rem; padding-right: 1rem" @click="retryFetch">Retry</button>
        </div>
        <div v-else class="p-5 grid gap-4 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1">
            <BudgetCard v-for="budget in budgets" :budget="budget" class="w-full"></BudgetCard>
        </div>
    </div>
</template>

<script setup>
import useAPIFetch from '~/composables/useAPIFetch';

const user = await useAuthUser();

let { data: budgets, error, refresh } = await useAPIFetch('/api/budgets');

const retryFetch = useThrottleFn(refresh, 1000);

async function fetchBudgets() {
    let result = await useAPIFetch('/api/budgets');
    budgets.value = result.data.value;
    error.value = result.error.value;
}

async function logout() {
    const { setIsAuthenticated } = useIsAuthenticated();
    await useAPIFetch('/api/logout', { method: 'POST' });
    setIsAuthenticated(false);
    await navigateTo('/login');
}
</script>