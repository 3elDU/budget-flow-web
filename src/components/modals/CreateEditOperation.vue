<script setup>
import { ref, watch, toRaw } from 'vue';
import api from '@/plugins/api.js';
import { useToast } from 'primevue/usetoast';
import { parseDate } from '@/plugins/helpers.js';

const toast = useToast();

const form = ref();
const isLoading = ref(false);

const props = defineProps({
  budget: {
    type: Object,
    required: false,
    default: null,
  },
  operation: {
    type: Object,
    required: false,
    default: null,
  },
  categories: {
    type: Array,
    required: true,
  },
  isVisible: {
    type: Boolean,
    required: true,
  },
});
const emits = defineEmits(['update:isVisible', 'update:operation', 'refresh']);

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

function close() {
  emits('update:isVisible', false);
  emits('update:operation', null);
  operationForm.value = {
    budget_id: null,
    name: '',
    description: null,
    categories: [],
    made_at: null,
    amount: null,
  };
}

const operationForm = ref({
  budget_id: null,
  name: '',
  description: null,
  categories: [],
  made_at: null,
  amount: null,
});

watch(() => props.isVisible, (value) => {
  if (value) {
    if (props.operation) {
      operationForm.value = structuredClone(toRaw(props.operation));
      operationForm.value.categories = operationForm.value.categories.map((category) => category.id);
      operationForm.value.made_at = parseDate(operationForm.value.made_at);
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
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: response.data.message ?? 'Failed to save operation',
      life: 3000,
    });
  }

  isLoading.value = false;
}
</script>

<template>
  <Dialog
    :visible="isVisible"
    modal
    :header="props.operation ? 'Edit operation' : 'Create operation'"
    :style="{ width: '600px' }"
    @update:visible="close"
  >
    <div class="flex flex-col gap-8">
      <form ref="form" class="flex flex-col gap-4">
        <div>
          <label class="block text-sm text-secondaryfg" for="budget">Budget</label>
          <Dropdown
            id="budget"
            v-model="operationForm.budget_id"
            required
            class="w-full"
            option-value="id"
            option-label="name"
            :options="budgets"
          />
        </div>

        <div>
          <label class="block text-sm text-secondaryfg" for="made_at">Made at</label>
          <Calendar
            id="made_at"
            v-model="operationForm.made_at"
            class="w-full"
            required
            show-time
          />
        </div>

        <div>
          <label class="block text-sm text-secondaryfg" for="name">Name</label>
          <InputText
            id="name"
            v-model="operationForm.name"
            required
            class="w-full"
          />
        </div>

        <div>
          <label class="block text-sm text-secondaryfg" for="description">Description (optional)</label>
          <Textarea id="description" v-model="operationForm.description" class="w-full max-h-[10rem]" />
        </div>

        <div>
          <label class="block text-sm text-secondaryfg" for="categories">Categories</label>
          <MultiSelect
            id="categories"
            v-model="operationForm.categories"
            class="w-full"
            required
            :options="categories"
            option-label="name"
            option-value="id"
          />
        </div>

        <div>
          <label class="block text-sm text-secondaryfg" for="amount">Amount</label>
          <InputNumber
            id="amount"
            v-model="operationForm.amount"
            class="w-full"
            max-fraction-digits="2"
            locale="en-US"
            required
          />
        </div>
      </form>
    </div>

    <template #footer>
      <div class="flex gap-2 mt-2">
        <Button
          :loading="isLoading"
          label="Submit"
          severity="success"
          @click="submit"
        />

        <Button
          :loading="isLoading"
          label="Cancel"
          severity="danger"
          @click="close"
        />
      </div>
    </template>
  </Dialog>
</template>
