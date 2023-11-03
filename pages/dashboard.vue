<template>
    <title>Dashboard</title>

    <!-- Navbar -->
    <nav class="w-display bg-secondary flex flex-row px-6 py-2.5 gap-6 font-bold text-xl items-center">
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
    <div class="m-5 p-5 grid gap-4 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1">
        <BudgetCard v-for="budget in budgets" :id="budget.id" class="w-full"></BudgetCard>
    </div>
</template>

<script setup>
import useAPIFetch from '~/composables/useAPIFetch';

const user = await useAuthUser();
console.log(user);

const { data: budgets } = await useAPIFetch('/api/budgets');


function logout() {
    const { setIsAuthenticated } = useIsAuthenticated();
    useAPIFetch('/api/logout', { method: 'POST' });
    setIsAuthenticated(false);
    navigateTo('/login');
}
</script>