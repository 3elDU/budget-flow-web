<script setup>
import { computed } from 'vue';
import { Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Colors,
} from 'chart.js';
import {formatMoney} from "@/plugins/helpers.js";

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  data: {
    type: Object,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  // USD, EUR, UAH, etc...
  currency: {
    type: String,
    default: null,
  },
});

const singleDataPoint = computed(
  () => props?.data?.datasets[0]?.data?.length === 1
);

const hideChart = computed(() => singleDataPoint.value || props.loading);

// Registering required library functionality
ChartJS.register(
  Title,
  Tooltip,
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Colors
);

// Default, global settings for the chart
ChartJS.defaults.responsive = true;
ChartJS.defaults.font.family = "Inter";
ChartJS.defaults.scale.grid.color = "rgba(150, 150, 150, 0.5)";
ChartJS.defaults.scale.ticks.color = "#B0B5B6";
// "Smooth out" transitions between data points
ChartJS.defaults.datasets.line.cubicInterpolationMode = "monotone";

let chartOptions = {};
// If 'currency' prop is set, adjust chart settings to properly format Y ticks and tooltip as a currency
if (props.currency) {
  chartOptions = {
    plugins: {
      tooltip: {
        callbacks: {
          // Customize tooltip label to include currency formatting
          label: function (context) {
            return (
              context.dataset.label +
              ': ' +
              formatMoney(context.parsed.y, props.currency)
            );
          },
        },
      },
    },
    scales: {
      y: {
        ticks: {
          // Customize y-axis ticks to include currency formatting
          callback: function (value) {
            return formatMoney(value, props.currency);
          },
        },
      },
    },
  };
}
</script>

<template>
  <div class="relative p-4 bg-secondary rounded-2xl flex flex-col items-center gap-4">
    <p class="text-xl font-bold">
      {{ props.label }}
    </p>

    <Line
      :data="props.data"
      :options="chartOptions"
      class="transition-opacity duration-300 ease-in-out"
      :style="hideChart ? 'opacity: 0' : null"
    />

    <div class="absolute mx-8 top-1/2 -translate-y-1/3 flex flex-col sm:flex-row gap-4">
      <div v-if="props.loading">
        <ProgressSpinner />
      </div>
      <div
        v-for="(dataset, i) in data.datasets"
        v-else-if="singleDataPoint"
        :key="i"
        class="text-center"
      >
        <div class="text-2xl font-bold">
          {{ props.currency ? formatMoney(dataset.data[0], currency) : dataset.data[0] }}
        </div>
        <div>{{ dataset.label }}</div>
      </div>
    </div>
  </div>
</template>
