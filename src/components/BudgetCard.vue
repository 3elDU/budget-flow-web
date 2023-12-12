<script setup>
import { ref, computed } from 'vue';
import api from '@/plugins/api.js';
import { formatMoney } from '@/plugins/helpers.js';

const emits = defineEmits(['refresh', 'edit']);
const props = defineProps({ budget: Object });

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

      <div class="text-2xl font-black">{{ balance }}</div>

      <div class="flex mt-auto p-buttonset">
        <Button severity="success" :loading="isLoading" class="!w-full !flex justify-center py-1">
          <IconMdiArrowUp font-size="24" />
        </Button>

        <Button severity="danger" :loading="isLoading" class="!w-full !flex justify-center py-1">
          <IconMdiArrowDown font-size="24" />
        </Button>

        <Button severity="warning" @click="editBudget" :loading="isLoading" class="!w-full !flex justify-center py-1">
          <IconMdiEdit font-size="24" />
        </Button>

        <Button severity="danger" @click="deleteBudget" :loading="isLoading" class="!w-full !flex justify-center py-1">
          <IconMdiDelete font-size="24" />
        </Button>
      </div>
    </div>

    <ModalsConfirmationModal ref="modal" />
  </div>
</template>
