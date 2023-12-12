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

const filters = computed(() => {
  const filters = [];

  if (filterName.value.value) {
    filters.push(filterName.value);
  }

  if (filterDescription.value.value) {
    filters.push(filterDescription.value);
  }

  if (filterCategories.value.value) {
    filters.push(filterCategories.value);
  }

  if (filterMadeAt.value.operator && filterMadeAt.value.value) {
    filters.push(filterMadeAt.value);
  }

  if (filterAmount.value.operator && filterAmount.value.value) {
    filters.push(filterAmount.value);
  }

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
        <InputText id="filterName" class="w-full" v-model="filterName.value" />
      </div>

      <div>
        <label for="filterDescription">Description</label>
        <InputText id="filterDescription" class="w-full" v-model="filterDescription.value" />
      </div>

      <div>
        <label for="filterCategories">Category</label>
        <MultiSelect
          id="filterCategories"
          class="w-full"
          v-model="filterCategories.value"
          :options="categories"
          option-value="id"
          option-label="name"
        />
      </div>

      <div>
        <label for="filterDate">Made at</label>
        <div class="flex gap-2">
          <Dropdown
            :options="filterTypes"
            v-model="filterMadeAt.operator"
            class="w-32 flex-none"
          />

          <Calendar id="filterDate" v-model="filterMadeAt.value" />

          <Button
            class="p-0 flex-none w-[50px] flex justify-center"
            v-if="filterMadeAt.value || filterMadeAt.operator"
            @click="clearFilter(filterMadeAt, true)"
          >
            <IconMdiClose font-size="24" />
          </Button>
        </div>
      </div>

      <div>
        <label for="filterAmount">Amount</label>
        <div class="flex gap-2">
          <Dropdown
            :options="filterTypes"
            v-model="filterAmount.operator"
            class="w-32 flex-none"
          />

          <InputNumber
            id="filterAmount"
            :max-fraction-digits="2"
            inputStyle="width: 1%"
            v-model="filterAmount.value"
          />

          <Button
            class="p-0 flex-none w-[50px] flex justify-center"
            v-if="filterAmount.value || filterAmount.operator"
            @click="clearFilter(filterAmount, true)"
          >
            <IconMdiClose font-size="24" />
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
