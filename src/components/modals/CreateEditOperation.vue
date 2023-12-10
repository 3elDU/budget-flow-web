<script setup>
import { ref, watch, toRaw } from 'vue';
import api from '@/plugins/api.js';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const form = ref();
const isLoading = ref(false);
const isError = ref();

const props = defineProps({
  budget: {
    type: Object,
    required: false,
  },
  operation: {
    type: Object,
    required: false,
  },
  isVisible: {
    type: Boolean,
    required: true,
  },
});
const emits = defineEmits(['update:isVisible', 'update:budget', 'refresh']);

const budgets = ref([]);

async function fetchBudgets() {
  isLoading.value = true;

  const response = await api.get('budgets');

  if (response.status === 200) {
    budgets.value = response.data;
  } else {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load budgets', life: 3000 });
  }

  isLoading.value = false;
}

fetchBudgets();

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

function close() {
  emits('update:isVisible', false);
  emits('update:operation', null);
  operationForm.value = {
    budget_id: null,
    name: '',
    description: null,
    categories: [],
    created_at: null,
    amount: null,
  };
}

const operationForm = ref({
  budget_id: null,
  name: '',
  description: null,
  categories: [],
  created_at: null,
  amount: null,
});

watch(() => props.isVisible, (value) => {
  if (value) {
    if (props.operation) {
      operationForm.value = structuredClone(toRaw(props.operation));
      operationForm.value.categories = operationForm.value.categories.map((category) => category.id);
      operationForm.value.created_at = new Date(operationForm.value.created_at);
    }
  }
});

async function submit() {
  if (isLoading.value) {
    return;
  }

  if (!form.value?.checkValidity()) {
    return;
  }

  isLoading.value = true;

  let response;

  if (props.operation) {
    response = await api.put(`operations/${props.operation.id}`, operationForm.value);
  } else {
    response = await api.post(`budgets/${operationForm.value.budget_id}/operations`, operationForm.value);
  }

  if (response.status === 200 || response.status === 201) {
    toast.add({ severity: 'success', summary: 'Success', detail: 'Operation saved', life: 3000 });
    close();
    emits('refresh');
  } else {
    isError.value = response.data.message;
  }

  isLoading.value = false;
}
</script>

<template>
  <Dialog
    v-bind:visible="isVisible"
    modal
    :header="props.operation ? 'Edit operation' : 'Create operation'"
    :pt="{ mask: { style: 'backdrop-filter: blur(2px)' } }"
    :style="{ width: '400px' }"
    @update:visible="close"
  >
    <div class="flex flex-col gap-8">
      <form ref="form" class="flex flex-col gap-4">
        <div>
          <label class="block text-sm text-secondaryfg" for="budget">Budget</label>
          <Dropdown
            v-model="operationForm.budget_id"
            id="budget"
            required
            class="w-full"
            option-value="id"
            option-label="name"
            :options="budgets"
          />
        </div>

        <div>
          <label class="block text-sm text-secondaryfg" for="name">Name</label>
          <InputText
            v-model="operationForm.name"
            id="name"
            required
            class="w-full"
          />
        </div>

        <div>
          <label class="block text-sm text-secondaryfg" for="description">Description (optional)</label>
          <Textarea v-model="operationForm.description" id="description" class="w-full max-h-[10rem]" />
        </div>

        <div>
          <label class="block text-sm text-secondaryfg" for="categories">Categories</label>
          <MultiSelect
            class="w-full"
            v-model="operationForm.categories"
            id="categories"
            required
            :options="categories"
            option-label="name"
            option-value="id"
          />
        </div>

        <div>
          <label class="block text-sm text-secondaryfg" for="created_at">Created at</label>
          <Calendar
            class="w-full"
            v-model="operationForm.created_at"
            id="created_at"
            required
            show-time
          />
        </div>

        <div>
          <label class="block text-sm text-secondaryfg" for="amount">Amount</label>
          <InputNumber
            class="w-full"
            max-fraction-digits="2"
            locale="en-US"
            v-model="operationForm.amount"
            id="amount"
            required
          />
        </div>
      </form>

      <div class="flex gap-2">
        <Button
          @click="submit"
          :loading="isLoading"
          label="Submit"
          severity="success"
        />

        <Button
          @click="close"
          :loading="isLoading"
          label="Cancel"
          severity="danger"
        />
      </div>
    </div>
  </Dialog>
</template>
