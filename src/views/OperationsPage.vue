<script setup>
import {ref, computed} from 'vue';
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

function changePage({ page }) {
  const newPage = page + 1;

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

const groupByDates = ref(true);
</script>

<template>
  <div class="flex justify-center gap-4 p-4 overflow-hidden">
    <div>
      <DataTable
        :value="groupedOperations"
        :total-records="meta.total"
        tableStyle="min-width: 66%"
        scroll-height="calc(100vh - 164px)"
        :rows="meta.per_page"
        :rowsPerPageOptions="[10, 20, 50]"
        :loading="isLoading"
        scrollable
        group-rows-by="monthYear"
        :row-group-mode="groupByDates ? 'subheader' : null"
      >
        <template #groupheader="{ data }">
          <span class="text-gray-200">{{ data.monthYear }}</span>
        </template>

        <Column field="name" header="Name" />
        <Column field="description" header="Description">
          <template #body="{ data }">
            <div v-tooltip="data.description" class="w-5" v-if="data.description">
              <IconMdiInfo font-size="24px" />
            </div>
          </template>
        </Column>
        <Column field="categories" header="Categories" style="max-width: 25%">
          <template #body="{ data }">
            <Tag v-for="category in data.categories" :value="category.name" rounded class="m-0.5" :style="`background: ${category.color_hex}`" />
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
            {{ formatMoney(data.amount, getCurrency(data)) }}
          </template>
        </Column>

        <Column field="id" header="Actions">
          <template #body="{ data }">
            <div class="flex gap-2">
              <Button @click="editOperation(data)" class="p-2">
                <IconMdiEdit font-size="24" />
              </Button>

              <Button severity="danger" @click="deleteOperation(data)" class="p-2">
                <IconMdiDelete font-size="24" />
              </Button>
            </div>
          </template>
        </Column>

        <!-- Workaround for colspan count bug -->
        <Column class="p-0" />
      </DataTable>

      <Paginator
        :totalRecords="meta.total"
        v-model:rows="perPage"
        :first="1"
        :currentPage="meta.current_page"
        :rowsPerPageOptions="[10, 20, 30]"
        @page="changePage"
      >
        <template #start>
          <Button label="Create" @click="isVisibleOperationModal = true" />
        </template>

        <template #end>
          <div class="flex items-center">
            <InputSwitch v-model="groupByDates" />
            <span class="ml-2">Group by dates</span>
          </div>
        </template>
      </Paginator>
    </div>

    <FiltersPanel
      v-model="filters"
      @apply-filters="fetchOperations"
      :categories="categories"
    />

    <CreateEditOperation
      v-model:is-visible="isVisibleOperationModal"
      v-model:operation="operation"
      @refresh="fetchOperations"
      :categories="categories"
    />

    <ModalsConfirmationModal ref="modal" />
  </div>
</template>
