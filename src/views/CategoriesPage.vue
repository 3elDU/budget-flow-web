<script setup>
import CreateEditCategory from '@/components/modals/CreateEditCategory.vue';
import { useToast } from 'primevue/usetoast';
import api from '@/plugins/api.js';
import { ref } from 'vue';

const toast = useToast();

const isVisibleCategoryModal = ref(false);
const category = ref(null);
const categories = ref([]);
const isLoading = ref(false);

async function fetchCategories() {
  isLoading.value = true;

  const response = await api.get('categories');

  if (response.status === 200) {
    categories.value = response.data;
  } else {
    toast.add({severity: 'error', summary: 'Error', detail: 'Failed to load categories', life: 3000});
  }

  isLoading.value = false;
}

fetchCategories();

function editCategory(item) {
  category.value = item;
  isVisibleCategoryModal.value = true;
}

const modal = ref(null);

async function deleteCategory(item) {
  if (!await modal.value.confirm()) {
    return;
  }

  const response = await api.delete(`categories/${item.id}`);

  if (response.status === 204) {
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Category deleted',
      life: 3000,
    });
    await fetchCategories();
  } else {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to delete category',
      life: 3000,
    });
  }
}
</script>

<template>
  <div class="p-2">
    <DataTable
      :loading="isLoading"
      scrollable
      scroll-height="calc(100vh - 200px)"
      :value="categories"
    >
      <template #header>
        <Button icon="pi pi-plus" label="Create" @click="isVisibleCategoryModal = true" />
      </template>

      <Column field="name" header="Name" />
      <Column field="description" header="Description" />
      <Column field="color_hex" header="Color">
        <template #body="slotProps">
          <div class="flex items-center">
            <div class="w-8 h-8 rounded mr-2" :style="{ backgroundColor: slotProps.data.color_hex }" />

            {{ slotProps.data.color_hex }}
          </div>
        </template>
      </Column>

      <Column field="created_at" header="Created at">
        <template #body="slotProps">
          {{ new Date(slotProps.data.created_at).toLocaleDateString() }}
        </template>
      </Column>

      <Column field="updated_at" header="Updated at">
        <template #body="slotProps">
          {{ new Date(slotProps.data.updated_at).toLocaleDateString() }}
        </template>
      </Column>

      <Column field="actions" header="Actions">
        <template #body="slotProps">
          <div class="flex gap-2">
            <Button class="p-2" @click="editCategory(slotProps.data)">
              <i class="pi pi-pencil text-xl" />
            </Button>

            <Button severity="danger" class="p-2" @click="deleteCategory(slotProps.data)">
              <i class="pi pi-trash text-xl" />
            </Button>
          </div>
        </template>
      </Column>
    </DataTable>

    <CreateEditCategory
      v-model:is-visible="isVisibleCategoryModal"
      v-model:category="category"
      @refresh="fetchCategories"
    />

    <ConfirmationModal ref="modal" />
  </div>
</template>
