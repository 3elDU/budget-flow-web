<script setup>
import { ref } from 'vue';
import api from '@/plugins/api.js';
import { useToast } from 'primevue/usetoast';
import Paginator from 'primevue/paginator';

const toast = useToast();

const isLoading = ref(false);
const operations = ref([]);
const meta = ref({});
const perPage = ref(10);

async function fetchOperations() {
  isLoading.value = true;

  const response = await api.get('/operations', {
    params: {
      page: meta.value.current_page ?? 1,
      per_page: perPage.value,
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

const filterTypes = ['=', '!=', '>', '<', '>=', '<=', 'like', 'not like'];
</script>

<template>
  <div class="flex justify-center gap-4 p-4">
    <div>
      <DataTable
        :value="operations"
        :total-records="meta.total"
        tableStyle="min-width: 66%"
        scroll-height="calc(100vh - 164px)"
        :rows="meta.per_page"
        :rowsPerPageOptions="[10, 20, 50]"
        :loading="isLoading"
        scrollable
      >
        <Column field="name" header="Name" />
        <Column field="description" header="Description" style="max-width: 10%" />
        <Column field="categories" header="Categories" style="max-width: 25%">
          <template #body="slotProps">
            <Tag v-for="category in slotProps.data.categories" :value="category.name" rounded class="m-0.5" :style="`background: ${category.color_hex}`" />
          </template>
        </Column>
        <Column field="created_at" header="Date">
          <template #body="slotProps">
            {{ new Date(slotProps.data.created_at).toLocaleDateString() }}
          </template>
        </Column>
        <Column field="amount" header="Amount">
          <template #body="slotProps">
            {{ slotProps.data.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) }}
          </template>
        </Column>

      </DataTable>

      <Paginator
        :totalRecords="meta.total"
        v-model:rows="perPage"
        :first="1"
        :currentPage="meta.current_page"
        :rowsPerPageOptions="[10, 20, 30]"
        @page="changePage"
      />
    </div>

    <Panel header="Filters">
      <div class="flex flex-col gap-4 w-64">
        <div>
          <label for="name">Name</label>
          <InputText id="name" />
        </div>

        <div>
          <label for="description">Description</label>
          <InputText id="description" />
        </div>

        <div>
          <label for="category">Category</label>
          <Dropdown id="category" class="w-full" />
        </div>

        <div>
          <label for="date">Date</label>
          <div class="flex gap-2">
            <Dropdown :options="filterTypes" />
            <Calendar id="date" />
          </div>
        </div>

        <div>
          <label for="amount">Amount</label>
          <div class="flex gap-2">
            <Dropdown :options="filterTypes" />
            <InputNumber id="amount" :max-fraction-digits="2" inputStyle="width: 1%" />
          </div>
        </div>

        <Button label="Apply" severity="primary" />
        <Button label="Reset" severity="secondary" />
      </div>
    </Panel>
  </div>
</template>
