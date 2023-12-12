<script setup>
import { ref, computed } from 'vue';
import { useDebounceFn } from '@vueuse/core';
import { useUserStore } from '@/stores/userStore.js';
import api from '@/plugins/api.js';
import { format } from 'date-fns';
import LineChart from "@/components/LineChart.vue";

const userStore = useUserStore();

const user = userStore.user;

const periods = [
  { label: 'Day', value: 'day' },
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
  { label: 'Quarter', value: 'quarter' },
  { label: 'Year', value: 'year' },
  { label: 'All', value: 'all' },
];

const period = ref('day');
const startTime = ref(null);
const endTime = ref(null);
const isLoading = ref(false);
const isError = ref(false);

const data = ref([]);

async function fetchAnalytics() {
  isLoading.value = true;

  const params = { period: period.value };

  if (startTime.value) {
    params.start_time = format(startTime.value, 'yyyy-MM-dd 00:00:00');
  }

  if (endTime.value) {
    params.end_time = format(endTime.value, 'yyyy-MM-dd 23:59:59');
  }

  const response = await api.get('analytics', { params });

  if (response.status === 200) {
    data.value = response.data;
  } else {
    isError.value = true;
  }

  isLoading.value = false;
}

fetchAnalytics();

// Wrap refresh in a debounce function to not send too many requests
const refreshData = useDebounceFn(fetchAnalytics, 1000);

const dateFormatter = Intl.DateTimeFormat(navigator.language);

// Wrap chart data calculation in a computed, so when response from the API changes,
// chart data will be automatically recomputed
const chartData = computed(() => {
  const labels = data.value.map((item) =>
    dateFormatter.format(new Date(item.period[0]))
  );

  const incomeData = data.value.map((item) => item.income);
  const averageIncomeData = data.value.map((item) => item.average_income);

  const incomeChartData = {
    labels: labels,
    datasets: [
      {
        label: 'Income',
        data: incomeData,
        borderColor: "rgb(70, 255, 70)",
      },
      {
        label: 'Average income',
        data: averageIncomeData,
        borderColor: 'rgba(70, 255, 70, 0.6)',
      },
    ],
  };

  const expenseData = data.value.map((item) => item.expense);
  const averageExpenseData = data.value.map((item) => item.average_expense);

  const expenseChartData = {
    labels: labels,
    datasets: [
      {
        label: 'Expense',
        data: expenseData,
        borderColor: 'rgb(255, 70, 70)'
      },
      {
        label: "Average expense",
        data: averageExpenseData,
        borderColor: "rgba(255, 70, 70, 0.6)",
      },
    ],
  };

  const balanceData = data.value.map((item) => item.budget_amount);
  const balanceChartData = {
    labels: labels,
    datasets: [{ label: "Balance", data: balanceData, borderColor: "white" }],
  };

  return {
    income: incomeChartData,
    expense: expenseChartData,
    balance: balanceChartData,
  };
});
</script>

<template>
  <div class="p-4 flex flex-col gap-6">
    <Toolbar>
      <template #center>
        <div class="flex flex-col sm:flex-row flex-wrap gap-4">
          <div class="w-full sm:w-fit">
            <label class="text-sm mr-2" for="startDate">Start date</label>

            <Calendar id="startDate" v-model="startTime" @update:model-value="refreshData()" />
          </div>

          <div class="w-full sm:w-fit">
            <label class="text-sm mr-2" for="endDate">End date</label>

            <Calendar id="endDate" v-model="endTime" @update:model-value="refreshData()" />
          </div>

          <div>
            <label class="text-sm mr-2" for="period">Period</label>
            <Dropdown
              id="period"
              v-model="period"
              :options="periods"
              option-label="label"
              option-value="value"
              @change="refreshData()"
            />
          </div>
        </div>
      </template>
    </Toolbar>

    <div v-if="isError">
      <p class="text-xl font-bold">
        No analytics available
      </p>
    </div>

    <div class="flex flex-row flex-wrap gap-4 justify-center">
      <LineChart
        :loading="isLoading"
        :currency="user.settings?.preferred_currency_iso ?? 'USD'"
        :data="chartData.income"
        label="Income"
        class="w-full max-w-2xl"
      />
      <LineChart
        :loading="isLoading"
        :currency="user.settings?.preferred_currency_iso ?? 'USD'"
        :data="chartData.expense"
        label="Expense"
        class="w-full max-w-2xl"
      />
      <LineChart
        :loading="isLoading"
        :currency="user.settings?.preferred_currency_iso ?? 'USD'"
        :data="chartData.balance"
        label="Balance"
        class="w-full max-w-2xl"
      />
    </div>
  </div>
</template>
