<script setup>
import { ref, watch, toRaw } from 'vue';
import api from '@/plugins/api.js';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const form = ref();
const isLoading = ref(false);

const props = defineProps({
  category: {
    type: Object,
    required: false,
    default: null,
  },
  isVisible: {
    type: Boolean,
    required: true,
  },
});
const emits = defineEmits(['update:isVisible', 'update:category', 'refresh']);

function close() {
  emits('update:isVisible', false);
  emits('update:category', null);
  categoryForm.value = {
    name: '',
    description: null,
    color_hex: '#000000',
  };
}

const categoryForm = ref({
  name: '',
  description: null,
  color_hex: '#000000',
});

watch(() => props.isVisible, (value) => {
  if (value) {
    if (props.category) {
      categoryForm.value = structuredClone(toRaw(props.category));
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

  if (props.category) {
    response = await api.put(`categories/${props.category.id}`, categoryForm.value);
  } else {
    response = await api.post(`categories`, categoryForm.value);
  }

  if (response.status === 200 || response.status === 201) {
    toast.add({ severity: 'success', summary: 'Success', detail: 'Category saved', life: 3000 });
    close();
    emits('refresh');
  } else {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: response.data.message ?? 'Failed to save category',
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
    :header="props.category ? 'Edit category' : 'Create category'"
    :style="{ width: '400px' }"
    @update:visible="close"
  >
    <div class="flex flex-col gap-8">
      <form ref="form" class="flex flex-col gap-4">
        <div>
          <label class="block text-sm text-secondaryfg" for="name">Name</label>
          <InputText
            id="name"
            v-model="categoryForm.name"
            required
            class="w-full"
          />
        </div>

        <div>
          <label class="block text-sm text-secondaryfg" for="description">Description (optional)</label>
          <Textarea id="description" v-model="categoryForm.description" class="w-full max-h-[10rem]" />
        </div>

        <div>
          <label class="block text-sm text-secondaryfg" for="color_hex">Color</label>

          <div class="flex">
            <input
              id="color_hex"
              v-model="categoryForm.color_hex"
              type="color"
              class="mr-4 color-select-default"
              required
            >

            <InputText v-model="categoryForm.color_hex" required class="w-full" />
          </div>
        </div>
      </form>

      <div class="flex gap-2">
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
    </div>
  </Dialog>
</template>
