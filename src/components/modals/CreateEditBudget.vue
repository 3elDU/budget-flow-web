<template>
  <ModalsBaseModal persistent ref="modal">
    <ModalsErrorModal v-if="error" v-model="errorModal" :error="error" />

    <div class="flex flex-col gap-8">
      <p class="text-sm font-bold">
        {{ label }}
      </p>

      <form ref="form" class="flex flex-col gap-4">
        <label class="block">
          <span class="text-sm">Name</span>
          <input
            v-model="budget.name"
            @input="handleInput"
            required
            minlength="1"
            maxlength="255"
            class="mt-1 input-default w-full"
          />
        </label>

        <label class="block">
          <span class="text-sm">Description (optional)</span>
          <textarea
            v-model="budget.description"
            @input="handleInput"
            minlength="1"
            maxlength="4096"
            class="mt-1 input-default h-24 w-full"
          ></textarea>
        </label>

        <label class="block">
          <span class="text-sm">Currency</span>
          <select
            v-model="budget.currency_iso"
            required
            class="mt-1 select-default"
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="UAH">UAH</option>
          </select>
        </label>

        <label class="block">
          <span class="text-sm">Color</span>
          <div class="flex gap-2 items-center">
            <input
              v-model="budget.color_hex"
              type="color"
              class="mt-1 color-select-default"
            />
            <span class="font-mono">{{ budget.color_hex }}</span>
          </div>
        </label>
      </form>

      <div class="flex gap-2">
        <button
          :disabled="!formValid"
          @click="submit"
          class="btn-default sm:w-fit w-full flex gap-2"
        >
          <IconLineMdLoadingTwotoneLoop v-if="pending" />
          {{ buttonLabel }}
        </button>
        <button
          class="btn-default !bg-error sm:w-fit w-full"
          @click="modal.close()"
          :disabled="pending"
        >
          Cancel
        </button>
      </div>
    </div>
  </ModalsBaseModal>
</template>

<script setup>
import { ref, reactive, toRaw, computed, inject } from "vue";
import { useAPIOfetch } from "../../composables/useAPIFetch";

const bus = inject("bus");

const pending = ref(false);
const modal = ref();
const errorModal = ref(false);
const error = ref();

const props = defineProps({
  budget_id: {
    type: Number,
  },
  budget: {
    type: Object,
  },
});

/** @type {import('vue').Ref<HTMLFormElement?>} */
const form = ref();

let budget = props.budget_id
  ? structuredClone(toRaw(props.budget))
  : reactive({
      name: "",
      description: null,
      color_hex: "#c64600",
      currency_iso: "USD",
    });

const formValid = props.budget_id ? ref(true) : ref(false);
function handleInput() {
  // Check form validity each time the input event was triggered
  formValid.value = form.value?.checkValidity();
}

const label = computed(() => {
  if (props.budget_id) {
    return "Edit budget";
  } else {
    return "Create budget";
  }
});

const buttonLabel = computed(() => {
  if (props.budget_id) {
    return "Save";
  } else {
    return "Create";
  }
});

async function submit() {
  // Do not repeat a request if it is already pending
  if (pending.value) {
    return;
  }

  const route = props.budget_id
    ? `/api/budgets/${props.budget_id}`
    : "/api/budgets";
  const method = props.budget_id ? "PUT" : "POST";

  pending.value = true;
  useAPIOfetch(route, {
    method: method,
    body: JSON.stringify(budget),
  })
    .then(
      () => {
        bus.emit("refetch");
        modal.value.close();
      },
      (err) => {
        errorModal.value = true;
        error.value = err;
      }
    )
    .finally(() => {
      pending.value = false;
    });
}
</script>
