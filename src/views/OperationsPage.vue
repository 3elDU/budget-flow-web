<script setup>
import { ref } from 'vue';
import api from '@/plugins/api.js';
import { useToast } from 'primevue/usetoast';
import Paginator from 'primevue/paginator';
import CreateEditOperation from "@/components/modals/CreateEditOperation.vue";

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
</script>

<template>
  <div class="flex justify-center gap-4 p-4 overflow-hidden">
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
        <Column field="description" header="Description" style="max-width: 10%;  overflow-x: auto" />
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

        <Column>
          <template #body="slotProps">
            <div class="flex gap-2">
              <Button @click="editOperation(slotProps.data)" class="p-2">
                <IconMdiEdit font-size="24" />
              </Button>

              <Button severity="danger" @click="deleteOperation(slotProps.data)" class="p-2">
                <IconMdiDelete font-size="24" />
              </Button>
            </div>
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
      >
        <template #start>
          <Button label="Create" @click="isVisibleOperationModal = true" />
        </template>
      </Paginator>
    </div>

    <Panel header="Filters">
      <div class="flex flex-col gap-4 w-64">
        <div>
          <label for="filterName">Name</label>
          <InputText id="filterName" />
        </div>

        <div>
          <label for="filterDescription">Description</label>
          <InputText id="filterDescription" />
        </div>

        <div>
          <label for="filterCategories">Category</label>
          <MultiSelect id="filterCategories" class="w-full" />
        </div>

        <div>
          <label for="filterDate">Date</label>
          <div class="flex gap-2">
            <Dropdown :options="filterTypes" />
            <Calendar id="filterDate" />
          </div>
        </div>

        <div>
          <label for="filterAmount">Amount</label>
          <div class="flex gap-2">
            <Dropdown :options="filterTypes" />
            <InputNumber id="filterAmount" :max-fraction-digits="2" locale="en-US" inputStyle="width: 1%" />
          </div>
        </div>

        <Button label="Apply" severity="primary" />
        <Button label="Reset" severity="secondary" />
      </div>
    </Panel>

    <CreateEditOperation
      v-model:is-visible="isVisibleOperationModal"
      v-model:operation="operation"
      @refresh="fetchOperations"
    />

    <ModalsConfirmationModal ref="modal" />
  </div>
</template>
