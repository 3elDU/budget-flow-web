<script setup>
import { ref } from 'vue';
import { useThrottleFn } from '@vueuse/core';
import api from '@/plugins/api.js';

const budgets = ref(null);
const isLoading = ref(false);
const isError = ref(null);

async function fetchBudgets() {
  isLoading.value = true;

  const response = await api.get('budgets');

  if (response.status === 200) {
    budgets.value = response.data;
  } else {
    isError.value = true;
  }

  isLoading.value = false;
}

fetchBudgets();

const retryFetch = useThrottleFn(fetchBudgets, 1000);

const isVisibleBudgetModal = ref(false);
const budget = ref(null);

function editBudget(item) {
  budget.value = item;
  isVisibleBudgetModal.value = true;
}
</script>

<template>
  <div class="p-4 h-full">
    <Transition mode="out-in">
      <div v-if="isError !== null" class="grow flex flex-col gap-4 justify-center items-center">
        <p class="text-3xl font-bold">Failed to load budgets</p>

        <Button label="Retry" @click="retryFetch" />
      </div>

      <div v-else-if="isLoading" class="flex flex-col justify-center items-center gap-2 h-full">
        <IconLineMdLoadingTwotoneLoop font-size="36px" />
        Loading budgets
      </div>

      <div v-else class="grid gap-4 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1">
        <div
          v-if="!isLoading"
          class="bg-secondary cursor-pointer rounded-lg p-4 flex flex-col justify-center items-center gap-2"
          @click="isVisibleBudgetModal = true"
        >
          <IconMdiPlus font-size="24px" />
          <span class="font-semibold">Create new budget</span>
        </div>

        <BudgetCard
          v-for="budget in budgets"
          :budget="budget"
          :key="budget.id"
          class="w-full"
          @edit="editBudget"
          @refresh="fetchBudgets"
        />
      </div>
    </Transition>

    <ModalsCreateEditBudget
      v-model:is-visible="isVisibleBudgetModal"
      v-model:budget="budget"
      @refresh="fetchBudgets"
    />
  </div>
</template>
