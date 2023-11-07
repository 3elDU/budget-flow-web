<template>
    <Title>Dashboard</Title>

    <!-- Main section -->
    <div v-if="error !== null" class="grow flex flex-col gap-4 justify-center items-center">
        <p class="text-3xl font-bold">Failed to load budgets</p>
        <button class="btn-default" style="padding-left: 1rem; padding-right: 1rem" @click="retryFetch">Retry</button>
    </div>
    <div v-else class="px-5 pt-6 grid gap-4 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1">
        <BudgetCard v-for="budget in budgets" :budget="budget" class="w-full"></BudgetCard>
    </div>
</template>

<script setup>
import useAPIFetch from '~/composables/useAPIFetch';

let { data: budgets, error, refresh } = await useAPIFetch('/api/budgets');

const retryFetch = useThrottleFn(refresh, 1000);

async function fetchBudgets() {
    let result = await useAPIFetch('/api/budgets');
    budgets.value = result.data.value;
    error.value = result.error.value;
}
</script>