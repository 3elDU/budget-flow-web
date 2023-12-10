<script setup>
import { ref, watch, toRaw } from 'vue';
import api from '@/plugins/api.js';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const form = ref();
const isLoading = ref(false);

const props = defineProps({
  budget: {
    type: Object,
    required: false,
  },
  isVisible: {
    type: Boolean,
    required: true,
  },
});
const emits = defineEmits(['update:isVisible', 'update:budget', 'refresh']);

function close() {
  emits('update:isVisible', false);
  emits('update:budget', null);
  budgetForm.value = {
    name: '',
    description: null,
    color_hex: '#c64600',
    currency_iso: 'USD',
  };
}

const budgetForm = ref({
  name: '',
  description: null,
  color_hex: '#c64600',
  currency_iso: 'USD',
});

watch(() => props.isVisible, (value) => {
  if (value) {
    if (props.budget) {
      budgetForm.value = structuredClone(toRaw(props.budget));
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

  if (props.budget) {
    response = await api.put(`budgets/${props.budget.id}`, budgetForm.value);
  } else {
    response = await api.post(`budgets`, budgetForm.value);
  }

  if (response.status === 200 || response.status === 201) {
    toast.add({ severity: 'success', summary: 'Success', detail: 'Budget saved', life: 3000 });
    close();
    emits('refresh');
  } else {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: response.data.message ?? 'Failed to save budget',
      life: 3000,
    });
  }

  isLoading.value = false;
}
</script>

<template>
  <Dialog
    v-bind:visible="isVisible"
    modal
    :header="props.budget ? 'Edit budget' : 'Create budget'"
    :pt="{ mask: { style: 'backdrop-filter: blur(2px)' } }"
    :style="{ width: '400px' }"
    @update:visible="close"
  >
    <div class="flex flex-col gap-8">
      <form ref="form" class="flex flex-col gap-4">
        <div>
          <label class="block text-sm text-secondaryfg" for="name">Name</label>
          <InputText v-model="budgetForm.name" id="name" required class="w-full" />
        </div>

        <div>
          <label class="block text-sm text-secondaryfg" for="description">Description (optional)</label>
          <Textarea v-model="budgetForm.description" id="description" class="w-full max-h-[10rem]" />
        </div>

        <div>
          <label class="block text-sm text-secondaryfg" for="currency_iso">Currency</label>
          <Dropdown v-model="budgetForm.currency_iso" id="currency_iso" required :options="['USD', 'EUR', 'UAH']" />
        </div>

        <div>
          <label class="block text-sm text-secondaryfg" for="color_hex">Color</label>

          <div class="flex">
            <input
              v-model="budgetForm.color_hex"
              id="color_hex"
              type="color"
              class="mr-4 color-select-default"
              required
            />

            <InputText v-model="budgetForm.color_hex" required class="w-full" />
          </div>
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
