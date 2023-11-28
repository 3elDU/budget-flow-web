<template>
  <ModalsBaseModal persistent ref="modal">
    <div class="flex flex-col gap-6">
      <p class="font-bold">{{ intent }}</p>

      <div class="flex gap-2 self-end">
        <button @click="resolve(true)" class="btn-default !bg-error">
          {{ confirmation }}
        </button>
        <button @click="resolve(false)" class="btn-default">No</button>
      </div>
    </div>
  </ModalsBaseModal>
</template>

<script setup>
import { ref } from "vue";

const { intent, confirmation } = defineProps({
  intent: {
    type: String,
    required: true,
  },
  confirmation: {
    type: String,
    default: "Yes",
  },
});

const modal = ref();

/** @type {(value) => void} */
let resolveFn = undefined;
function resolve(value) {
  resolveFn(value);
  modal.value.close();
}

function ask() {
  return new Promise((resolve) => {
    resolveFn = resolve;
  });
}

defineExpose({ ask });
</script>
