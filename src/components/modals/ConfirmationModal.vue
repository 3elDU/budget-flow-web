<template>
  <Dialog v-model:visible="isVisible" modal header="Delete item">
    <div class="flex flex-col gap-6">
      <p>{{ text }}</p>

      <div class="flex gap-2 self-end">
        <Button @click="resolve(true)" severity="danger" :label="confirmation" />
        <Button @click="resolve(false)" label="No" />
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import { ref } from 'vue';

defineProps({
  text: {
    type: String,
    default: 'Are you sure you want to delete this item?',
  },
  confirmation: {
    type: String,
    default: 'Yes',
  },
});

const isVisible = ref(false);

/** @type {(value) => void} */
let resolveFn = undefined;

function resolve(value) {
  resolveFn(value);
  isVisible.value = false;
}

function confirm() {
  isVisible.value = true;

  return new Promise((resolve) => {
    resolveFn = resolve;
  });
}

defineExpose({ confirm });
</script>
