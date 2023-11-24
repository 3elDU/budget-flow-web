<template>
    <div class="mx-4 flex flex-col gap-6">
        <Title>Analytics</Title>
        <div class="flex flex-col sm:flex-row flex-wrap gap-4">
            <div class="flex gap-4">
                <label class="block w-full sm:w-fit">
                    <span class="text-sm">Start date</span>
                    <input type="date" class="w-full sm:w-fit input-default mt-1" v-model="startTime" @submit="refreshData">
                </label>
                <label class="block w-full sm:w-fit">
                    <span class="text-sm">End date</span>
                    <input type="date" class="w-full sm:w-fit input-default mt-1" v-model="endTime" @submit="refreshData">
                </label>
            </div>
            <label class="block">
                <span class="text-sm">Period</span>
                <select class="select-default mt-1" v-model="period" @submit="refreshData">
                    <option v-for="period in periods" :value="period[0]">
                        {{ period[1] }}
                    </option>
                </select>
            </label>
        </div>

        <div v-if="error">
            <p class="text-xl font-bold">No analytics available</p>
        </div>

        <div v-if="data" class="flex flex-row flex-wrap gap-4 justify-center">
            <LineChart :loading="pending" :currency="user.settings.preferred_currency_iso" :data="chartData.income"
                label="Income" class="w-full max-w-2xl" />
            <LineChart :loading="pending" :currency="user.settings.preferred_currency_iso" :data="chartData.expense"
                label="Expense" class="w-full max-w-2xl" />
            <LineChart :loading="pending" :currency="user.settings.preferred_currency_iso" :data="chartData.balance"
                label="Balance" class="w-full max-w-2xl" />
        </div>
    </div>
</template>

<script setup>
const user = await useAuthUser();

const periods = [
    ["day", "Day"],
    ["week", "Week"],
    ["month", "Month"],
    ["quarter", "Quarter"],
    ["year", "Year"],
    ["all", "All"]
];

const period = ref("day");
const startTime = ref(null);
const endTime = ref(null);

const { pending, data, error, refresh } = await useAPIFetch('/api/analytics', {
    lazy: true,
    params: {
        period: period,
        start_time: startTime,
        end_time: endTime
    }
});
// Wrap refresh in a debounce function to not send too many requests
const refreshData = useDebounceFn(refresh, 1000);

const dateFormatter = Intl.DateTimeFormat(navigator.language);

// Wrap chart data calculation in a computed, so when response from the API changes,
// chart data will be automatically recomputed
const chartData = computed(() => {
    const labels = data.value.map((item) => dateFormatter.format(
        new Date(item.period[0])
    ));

    const incomeData = data.value.map((item) => item.income);
    const averageIncomeData = data.value.map((item) => item.average_income);

    const incomeChartData = {
        labels: labels,
        datasets: [
            { label: "Income", data: incomeData, borderColor: 'rgb(70, 255, 70)' },
            { label: "Average income", data: averageIncomeData, borderColor: 'rgba(70, 255, 70, 0.6)' }
        ]
    }

    const expenseData = data.value.map((item) => item.expense);
    const averageExpenseData = data.value.map((item) => item.average_expense);

    const expenseChartData = {
        labels: labels,
        datasets: [
            { label: "Expense", data: expenseData, borderColor: 'rgb(255, 70, 70)' },
            { label: "Average expense", data: averageExpenseData, borderColor: 'rgba(255, 70, 70, 0.6)' }
        ]
    }

    const balanceData = data.value.map((item) => item.budget_amount);
    const balanceChartData = {
        labels: labels,
        datasets: [{ label: "Balance", data: balanceData, borderColor: 'white' }]
    }

    return {
        income: incomeChartData,
        expense: expenseChartData,
        balance: balanceChartData
    }
});

</script>