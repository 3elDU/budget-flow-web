<script setup>
import {ref, computed, watch} from 'vue';
import api from '@/plugins/api.js';
import {useToast} from 'primevue/usetoast';
import {formatDate, formatMoney, parseDate} from '../plugins/helpers.js';
import Paginator from 'primevue/paginator';
import CreateEditOperation from '@/components/modals/CreateEditOperation.vue';
import FiltersPanel from '@/components/FiltersPanel.vue';
import {format} from "date-fns";

const toast = useToast();

const isLoading = ref(false);
const operations = ref([]);
const meta = ref({});
const perPage = ref(10);
const filters = ref([]);

const groupedOperations = computed(() => {
  const newOperations = operations.value;

  newOperations.forEach((operation) => {
    operation.monthYear = format(parseDate(operation.made_at), 'MMMM yyyy');
  });

  return newOperations;
});

async function fetchOperations() {
  isLoading.value = true;

  const response = await api.get('/operations', {
    params: {
      page: meta.value.current_page ?? 1,
      per_page: perPage.value,
      filters: filters.value,
    },
  });

  if (response.status === 200) {
    operations.value = response.data.data;
    meta.value = response.data.meta;
  } else {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: response.data.message ?? 'Failed to load operations',
      life: 3000,
    });
  }

  isLoading.value = false;
}

fetchOperations();

watch(perPage, () => {
  meta.value.current_page = 1;

  fetchOperations();
});

function changePage({ page }) {
  const newPage = page + 1;

  if (newPage === meta.value.current_page) {
    return;
  }

  meta.value.current_page = newPage;

  if (newPage >= 1 && newPage <= meta.value.last_page) {
    fetchOperations();
  }
}

const isVisibleOperationModal = ref(false);
const operation = ref(null);

function editOperation(item) {
  operation.value = item;
  isVisibleOperationModal.value = true;
}

const modal = ref();

async function deleteOperation(item) {
  if (isLoading.value) {
    return;
  }

  if (!await modal.value.confirm()) {
    return;
  }

  isLoading.value = true;

  const response = await api.delete(`operations/${item.id}`);

  if (response.status === 204) {
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Operation deleted',
      life: 3000,
    });
    await fetchOperations();
  } else {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: response.data.message ?? 'Failed to delete operation',
      life: 3000,
    });
  }

  isLoading.value = false;
}

const budgets = ref([]);

async function fetchBudgets() {
  isLoading.value = true;

  const response = await api.get('budgets');

  if (response.status === 200) {
    budgets.value = response.data;
  } else {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load budgets',
      life: 3000,
    });
  }

  isLoading.value = false;
}

fetchBudgets();

function getCurrency(item) {
  const budget = budgets.value.find((budget) => budget.id === item.budget_id);

  return budget?.currency_iso ?? 'USD';
}

const categories = ref([]);

async function fetchCategories() {
  isLoading.value = true;

  const response = await api.get('categories');

  if (response.status === 200) {
    categories.value = response.data;
  } else {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load categories', life: 3000 });
  }

  isLoading.value = false;
}

fetchCategories();

const settingsMenu = ref();
const groupByDates = ref(true);

function getTextColor(hexColor) {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  // Luminance algorithm
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  return brightness > 128 ? 'black' : 'white';
}
</script>

<template>
  <div class="flex justify-center gap-4 p-4 overflow-hidden">
    <div>
      <DataTable
        :value="groupedOperations"
        :total-records="meta.total"
        table-style="min-width: 66%"
        scroll-height="calc(100vh - 164px)"
        :rows="meta.per_page"
        :rows-per-page-options="[10, 20, 50]"
        :loading="isLoading"
        scrollable
        group-rows-by="monthYear"
        :row-group-mode="groupByDates ? 'subheader' : null"
      >
        <template #groupheader="{ data }">
          <span class="text-gray-400 text-sm">{{ data.monthYear }}</span>
        </template>

        <Column field="name" header="Name" />

        <Column field="description" header="Description">
          <template #body="{ data }">
            <div v-if="data.description" v-tooltip="data.description" class="w-5">
              <i class="pi pi-info-circle text-xl" />
            </div>
          </template>
        </Column>

        <Column field="categories" header="Categories" style="max-width: 25%">
          <template #body="{ data }">
            <Tag
              v-for="category in data.categories"
              :key="category.id"
              :value="category.name"
              rounded
              class="m-0.5"
              :style="`background: ${category.color_hex}; color: ${getTextColor(category.color_hex)};`"
            />
          </template>
        </Column>

        <Column field="created_at" header="Created at">
          <template #body="{ data }">
            {{ formatDate(parseDate(data.created_at)) }}
          </template>
        </Column>

        <Column field="made_at" header="Made at">
          <template #body="{ data }">
            {{ formatDate(parseDate(data.made_at)) }}
          </template>
        </Column>

        <Column field="amount" header="Amount" class="whitespace-nowrap">
          <template #body="{ data }">
            <span class="font-black">{{ formatMoney(data.amount, getCurrency(data)) }}</span>
          </template>
        </Column>

        <Column field="id" header="Actions">
          <template #body="{ data }">
            <div class="flex gap-2">
              <Button class="p-2" @click="editOperation(data)">
                <i class="pi pi-pencil text-xl" />
              </Button>

              <Button severity="danger" class="p-2" @click="deleteOperation(data)">
                <i class="pi pi-trash text-xl" />
              </Button>
            </div>
          </template>
        </Column>

        <!-- Workaround for colspan count bug -->
        <Column class="p-0" />
      </DataTable>

      <Paginator
        v-model:rows="perPage"
        :total-records="meta.total"
        :first="1"
        :current-page="meta.current_page"
        :rows-per-page-options="[10, 20, 30]"
        @page="changePage"
      >
        <template #start>
          <Button class="px-0 w-[50px] flex justify-center" @click="isVisibleOperationModal = true">
            <i class="pi pi-plus text-xl" />
          </Button>
        </template>

        <template #end>
          <Button class="px-0 w-[50px] flex justify-center" @click="settingsMenu?.toggle">
            <i class="pi pi-cog text-xl" />
          </Button>

          <OverlayPanel ref="settingsMenu">
            <div class="flex items-center">
              <InputSwitch v-model="groupByDates" />
              <span class="ml-2">Group by dates</span>
            </div>
          </OverlayPanel>
        </template>
      </Paginator>
    </div>

    <FiltersPanel
      v-model="filters"
      :categories="categories"
      :budgets="budgets"
      @apply-filters="fetchOperations"
    />

    <CreateEditOperation
      v-model:is-visible="isVisibleOperationModal"
      v-model:operation="operation"
      :categories="categories"
      @refresh="fetchOperations"
    />

    <ConfirmationModal ref="modal" />
  </div>
</template>
