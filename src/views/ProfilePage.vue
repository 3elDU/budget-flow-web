<template>
  <div class="px-5 flex flex-col items-center md:items-start">
    <h1 class="font-bold text-3xl mb-4">{{ user.name }}</h1>

    <div v-if="pending" class="flex gap-2">
      Loading user settings
      <IconLineMdLoadingTwotoneLoop font-size="24" />
    </div>
    <form v-else class="w-full max-w-[350px] grid grid-cols-1 gap-4">
      <label class="block">
        <span for="preferred_currency" class="text-sm">Preferred currency</span>
        <select
          :disabled="!editing"
          class="select-default mt-1 w-full"
          name="preferred_currency"
          v-model="settings.preferred_currency_iso"
        >
          <option
            v-for="currency in currenciesList"
            :key="currency.id"
            :value="currency"
          >
            {{ currency }}
          </option>
        </select>
      </label>

      <label class="inline-flex items-center">
        <input
          :disabled="!editing"
          class="checkbox-default mr-1"
          type="checkbox"
          name="show_fractional"
          v-model="settings.show_fractional"
        />
        <span class="ml-1 text-sm" for="show_fractional"
          >Show fractional numbers</span
        >
      </label>

      <div class="relative ml-auto md:ml-0 mt-4 flex">
        <Transition name="fade">
          <div v-if="editing" class="flex gap-2">
            <button class="btn-default" @click.prevent="saveChanges">
              <IconLineMdLoadingTwotoneLoop v-if="saving" />
              <IconMdiContentSave v-else />
              Save
            </button>
            <button
              class="btn-default !bg-error"
              @click.prevent="editing = false"
              :disabled="saving"
            >
              <IconMdiDelete />
              Cancel
            </button>
          </div>
          <button v-else class="btn-default" @click.prevent="editing = true">
            <IconMdiEdit />
            Edit
          </button>
        </Transition>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import useAuthUser from "../composables/useAuthUser";
import { useAPIFetch, useAPIOfetch } from "../composables/useAPIFetch";

const user = await useAuthUser();
const { data: settings, pending } = useAPIFetch("/api/users/me/settings");
const saving = ref(false);
const editing = ref(false);

const currenciesList = ["USD", "EUR", "UAH"];

async function saveChanges() {
  if (saving.value) {
    return;
  }

  saving.value = true;
  await useAPIOfetch("/api/users/me/settings", {
    method: "PUT",
    body: settings.value,
  });
  saving.value = false;
  editing.value = false;
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 200ms ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-leave-active {
  position: absolute;
}

@media (max-width: 768px) {
  .fade-leave-active {
    right: 0;
  }
}
</style>
