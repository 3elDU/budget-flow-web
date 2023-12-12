<script setup>
import {
  computed, isRef,
  nextTick,
  ref,
  watch,
} from 'vue';

defineProps({
  categories: {
    type: Array,
    required: true,
  },
});

const filterTypes = ['=', '!=', '>', '<', '>=', '<=', 'like', 'not like'];

const filterName = ref({
  type: 'where',
  field: 'name',
  operator: 'like',
  value: '',
});

const filterDescription = ref({
  type: 'where',
  field: 'description',
  operator: 'like',
  value: '',
});

const filterCategories = ref({
  type: 'whereIn',
  field: 'categories.id',
  operator: '=',
  value: '',
});

const filterMadeAt = ref({
  type: 'whereIn',
  field: 'made_at',
  operator: null,
  value: null,
});

const filterAmount = ref({
  type: 'whereIn',
  field: 'amount',
  operator: null,
  value: null,
});

const filterObjects = [
  filterName,
  filterDescription,
  filterCategories,
  filterMadeAt,
  filterAmount,
];

const filters = computed(() => {
  const filters = [];

  filterObjects.forEach((filter) => {
    if (filter.value.value !== '' && filter.value.value !== null) {
      filters.push(filter.value);
    }
  });

  return filters;
});

const emits = defineEmits(['update:modelValue', 'applyFilters']);

watch(filters, () => {
  emits('update:modelValue', filters.value);
}, { deep: true });

function clearFilter(filter, clearOperator = false) {
  if (isRef(filter)) {
    filter.value.value = null;

    if (clearOperator) {
      filter.value.operator = null;
    }
  } else {
    filter.value = null;

    if (clearOperator) {
      filter.operator = null;
    }
  }
}

function resetFilters() {
  clearFilter(filterName);
  clearFilter(filterDescription);
  clearFilter(filterCategories);
  clearFilter(filterMadeAt, true);
  clearFilter(filterAmount, true);

  nextTick(() => emits('applyFilters'));
}
</script>

<template>
  <Panel header="Filters">
    <div class="flex flex-col gap-4 w-96">
      <div>
        <label for="filterName">Name</label>
        <InputText id="filterName" v-model="filterName.value" class="w-full" />
      </div>

      <div>
        <label for="filterDescription">Description</label>
        <InputText id="filterDescription" v-model="filterDescription.value" class="w-full" />
      </div>

      <div>
        <label for="filterCategories">Category</label>
        <MultiSelect
          id="filterCategories"
          v-model="filterCategories.value"
          class="w-full"
          :options="categories"
          option-value="id"
          option-label="name"
        />
      </div>

      <div>
        <label for="filterDate">Made at</label>
        <div class="flex gap-2">
          <Dropdown
            v-model="filterMadeAt.operator"
            :options="filterTypes"
            class="w-32 flex-none"
          />

          <Calendar id="filterDate" v-model="filterMadeAt.value" />

          <Button
            v-if="filterMadeAt.value || filterMadeAt.operator"
            class="p-0 flex-none w-[50px] flex justify-center"
            @click="clearFilter(filterMadeAt, true)"
          >
            <i class="pi pi-times text-xl" />
          </Button>
        </div>
      </div>

      <div>
        <label for="filterAmount">Amount</label>
        <div class="flex gap-2">
          <Dropdown
            v-model="filterAmount.operator"
            :options="filterTypes"
            class="w-32 flex-none"
          />

          <InputNumber
            id="filterAmount"
            v-model="filterAmount.value"
            :max-fraction-digits="2"
            input-style="width: 1%"
          />

          <Button
            v-if="filterAmount.value || filterAmount.operator"
            class="p-0 flex-none w-[50px] flex justify-center"
            @click="clearFilter(filterAmount, true)"
          >
            <i class="pi pi-times text-xl" />
          </Button>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex flex-col gap-2">
        <Button label="Apply" severity="primary" @click="emits('applyFilters')" />
        <Button label="Reset" severity="secondary" @click="resetFilters" />
      </div>
    </template>
  </Panel>
</template>
