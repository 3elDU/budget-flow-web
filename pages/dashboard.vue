<template>
    <div>
        <Title>Dashboard</Title>

        <!-- Main section -->
        <div v-if="error !== null" class="grow flex flex-col gap-4 justify-center items-center">
            <p class="text-3xl font-bold">Failed to load budgets</p>
            <button class="btn-default" style="padding-left: 1rem; padding-right: 1rem" @click="retryFetch">Retry</button>
        </div>
        <div v-else class="px-5 grid gap-4 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1">
            <div class="bg-secondary cursor-pointer rounded-lg p-4 flex flex-col justify-center items-center gap-2"
                @click="modal = true">
                <Icon name="mdi:plus" size="24" />
                <span class="font-semibold">Create new budget</span>
                <ModalsCreateEditBudget v-model="modal" v-if="modal" />
            </div>
            <BudgetCard v-for="budget in budgets" :budget="budget" class="w-full"></BudgetCard>
        </div>
    </div>
</template>

<script setup>
const modal = ref(false);

let { data: budgets, error, refresh } = await useAPIFetch('/api/budgets');

useNuxtApp().$bus.on('refetch', refresh);

const retryFetch = useThrottleFn(refresh, 1000);
</script>