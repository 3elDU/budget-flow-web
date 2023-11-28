<template>
  <ModalsBaseModal ref="modal">
    <div class="flex flex-col gap-4">
      <p class="font-bold">Sorry, an error happened!</p>
      <p>{{ error }}</p>
      <button class="self-end btn-default !bg-error" @click="modal.close()">
        OK
      </button>
    </div>
  </ModalsBaseModal>
</template>

<script setup>
import { ref } from "vue";

const modal = ref();

const { error } = defineProps(["error"]);
</script>
