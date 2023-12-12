<script setup>
import { ref, computed } from 'vue';
import api from '@/plugins/api.js';
import { formatMoney } from '@/plugins/helpers.js';

const emits = defineEmits(['refresh', 'edit']);
const props = defineProps({
  budget: {
    type: Object,
    required: true,
  },
});

const modal = ref();
const isLoading = ref(false);

const balance = computed(() => {
  return formatMoney(props.budget.balance, props.budget.currency_iso);
});

function editBudget() {
  emits('edit', props.budget);
}

async function deleteBudget() {
  if (isLoading.value) {
    return;
  }

  if (!await modal.value.confirm()) {
    return;
  }

  isLoading.value = true;

  const response = await api.delete(`budgets/${props.budget.id}`);

  if (response.status === 200) {
    emits('refresh');
  }

  isLoading.value = false;
}
</script>

<template>
  <div
    class="bg-primary rounded-lg p-2"
    :style="{ backgroundColor: props.budget.color_hex }"
  >
    <div class="flex flex-col gap-1 rounded-lg p-2" style="background: rgba(0, 0, 0, .3)">
      <div class="text-lg font-bold truncate" :title="props.budget.name">
        {{ props.budget.name }}
      </div>

      <div class="text-sm truncate h-5" :title="props.budget.description">
        {{ props.budget.description }}
      </div>

      <div class="text-2xl font-black">
        {{ balance }}
      </div>

      <div class="flex mt-auto p-buttonset">
        <Button severity="success" :loading="isLoading" class="!w-full !flex justify-center py-1">
          <i class="pi pi-chevron-up text-xl" />
        </Button>

        <Button severity="danger" :loading="isLoading" class="!w-full !flex justify-center py-1">
          <i class="pi pi-chevron-down text-xl" />
        </Button>

        <Button
          severity="warning"
          :loading="isLoading"
          class="!w-full !flex justify-center py-1"
          @click="editBudget"
        >
          <i class="pi pi-pencil text-xl" />
        </Button>

        <Button
          severity="danger"
          :loading="isLoading"
          class="!w-full !flex justify-center py-1"
          @click="deleteBudget"
        >
          <i class="pi pi-trash text-xl" />
        </Button>
      </div>
    </div>

    <ConfirmationModal ref="modal" />
  </div>
</template>
