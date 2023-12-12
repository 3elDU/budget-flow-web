<script setup>
import { ref, toRaw } from 'vue';
import { useUserStore } from '@/stores/userStore.js';
import api from '@/plugins/api.js';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const userStore = useUserStore();
const user = userStore.user;
const isLoading = ref(false);
const isEditMode = ref(false);

const settings = ref(structuredClone(toRaw(user.settings)));

const currenciesList = ['USD', 'EUR', 'UAH'];

async function saveChanges() {
  if (isLoading.value) {
    return;
  }

  isLoading.value = true;

  const response = await api.put('users/me/settings', settings.value);

  if (response.status === 200) {
    isEditMode.value = false;
    user.settings = response.data;

    toast.add({ severity: 'success', summary: 'Success', detail: 'Settings saved', life: 3000 });
  }

  isLoading.value = false;
}
</script>

<template>
  <div class="p-4 flex flex-col items-center md:items-start">
    <h1 class="font-bold text-3xl mb-4">{{ user.name }}</h1>

    <form class="w-full max-w-[350px] grid grid-cols-1 gap-4">
      <div>
        <label for="preferredCurrencyIso" class="block text-sm">Preferred currency</label>

        <Dropdown
          :disabled="!isEditMode || isLoading"
          :options="currenciesList"
          v-model="settings.preferred_currency_iso"
          id="preferredCurrencyIso"
        />
      </div>

      <div>
        <Checkbox
          :disabled="!isEditMode || isLoading"
          v-model="settings.show_fractional"
          binary
          id="showFractional"
        />

        <label for="showFractional" class="ml-2 text-sm">Show fractional numbers</label>
      </div>

      <div class="ml-auto md:ml-0 mt-4 flex">
        <Transition mode="out-in">
          <div v-if="isEditMode" class="flex gap-2">
            <Button @click.prevent="saveChanges" label="Save" severity="success" :loading="isLoading" />
            <Button @click.prevent="isEditMode = false" label="Cancel" severity="danger" :loading="isLoading" />
          </div>
          <Button v-else @click.prevent="isEditMode = true" label="Edit" />
        </Transition>
      </div>
    </form>
  </div>
</template>
