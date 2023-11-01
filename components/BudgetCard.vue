<template>
    <div v-if="pending || amount_pending" class="flex w-full h-36 justify-center items-center">
        <Icon size="48" name="svg-spinners:ring-resize"></Icon>
    </div>
    <div v-else class="bg-primary rounded-lg flex flex-col p-3 gap-1"
        :style="{ backgroundColor: pending ? '@bg-primary' : budget.color_hex }">
        <div class="text-lg font-bold">{{ budget.name }}</div>
        <div class="text-sm truncate" :title="budget.description">{{ budget.description }}</div>
        <div class="text-2xl font-black">{{ amount }}$</div>

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
const props = defineProps({ 'id': Number });

const { data: budget, pending } = await useAPIFetch(`/api/budgets/${props.id}`, { lazy: true });
const { data: amount, pending: amount_pending } = await useAPIFetch(`/api/budgets/${props.id}/amount`, { lazy: true });
</script>