<template>
    <div class="bg-primary rounded-lg flex flex-col p-3 gap-1" :style="{ backgroundColor: props.budget.color_hex }">
        <div class="text-lg font-bold">{{ props.budget.name }}</div>
        <div class="text-sm truncate" :title="props.budget.description">{{ props.budget.description }}</div>
        <div class="text-2xl font-black">{{ balance }}</div>

        <div class="flex">
            <button class="w-full p-0.5 flex justify-center bg-success rounded-l-md">
                <Icon size="24" name="mdi:arrow-up"></Icon>
            </button>
            <button class="w-full p-0.5 flex justify-center bg-error">
                <Icon size="24" name="mdi:arrow-down"></Icon>
            </button>
            <button class="w-full p-0.5 flex justify-center bg-secondary rounded-r-md">
                <Icon size="24" name="mdi:information"></Icon>
            </button>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({ 'budget': Object });

const formatter = new Intl.NumberFormat(navigator.language, {
    style: 'currency',
    currency: props.budget.currency_iso
});

const balance = computed(() => formatter.format(props.budget.balance));
</script>