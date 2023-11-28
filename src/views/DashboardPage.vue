<template>
  <div>
    <!-- Main section -->
    <div
      v-if="error !== null"
      class="grow flex flex-col gap-4 justify-center items-center"
    >
      <p class="text-3xl font-bold">Failed to load budgets</p>
      <button
        class="btn-default"
        style="padding-left: 1rem; padding-right: 1rem"
        @click="retryFetch"
      >
        <IconLineMdLoadingTwotoneLoop v-if="pending" />
        Retry
      </button>
    </div>
    <div
      v-else
      class="px-5 grid gap-4 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1"
    >
      <div
        class="bg-secondary cursor-pointer rounded-lg p-4 flex flex-col justify-center items-center gap-2"
        @click="modal = true"
      >
        <IconMdiPlus font-size="24px" />
        <span class="font-semibold">Create new budget</span>
        <ModalsCreateEditBudget v-model="modal" v-if="modal" />
      </div>

      <div v-if="pending" class="flex justify-center items-center p-4 gap-2">
        <IconLineMdLoadingTwotoneLoop />
        Loading budgets
      </div>
      <BudgetCard
        v-else
        v-for="budget in budgets"
        :budget="budget"
        :key="budget.id"
        class="w-full"
      ></BudgetCard>
    </div>
  </div>
</template>

<script setup>
import { inject, ref } from "vue";
import { useAPIFetch } from "../composables/useAPIFetch";
import { useThrottleFn } from "@vueuse/core";
const modal = ref(false);

const { pending, data: budgets, error, refresh } = useAPIFetch("/api/budgets");
inject("bus").on("refetch", refresh);

const retryFetch = useThrottleFn(refresh, 1000);
</script>
