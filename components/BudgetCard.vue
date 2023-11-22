<template>
    <div class="bg-primary rounded-lg flex flex-col p-3 gap-1" :style="{ backgroundColor: props.budget.color_hex }">
        <div class="text-lg font-bold">{{ props.budget.name }}</div>
        <div class="text-sm truncate" :title="props.budget.description">{{ props.budget.description }}</div>
        <div class="text-2xl font-black">{{ balance }}</div>

        <div class="flex mt-auto">
            <button class="w-full p-0.5 flex justify-center bg-success rounded-l-md">
                <Icon size="24" name="mdi:arrow-up"></Icon>
            </button>
            <button class="w-full p-0.5 flex justify-center bg-error">
                <Icon size="24" name="mdi:arrow-down"></Icon>
            </button>
            <button class="w-full p-0.5 flex justify-center bg-secondary">
                <Icon size="24" name="mdi:edit" @click="editBudget"></Icon>
            </button>
            <button class="w-full p-0.5 flex justify-center bg-error rounded-r-md" @click="deleteBudget()">
                <ModalsConfirmation ref="confirmationModal" v-model="modal" intent="Are you sure to delete this budget?" />
                <!-- <ModalsErrorModal v-if="error" :error="error" v-model="error" /> -->
                <Icon size="24" name="mdi:delete"></Icon>
            </button>
        </div>
    </div>
</template>

<script setup>
import CreateEditBudget from './modals/CreateEditBudget.vue';
import ErrorModal from './modals/ErrorModal.vue';

const props = defineProps({ 'budget': Object });

const confirmationModal = ref();
const modal = ref(false);

const balance = computed(() => {
    return new Intl.NumberFormat(navigator.language, {
        style: 'currency',
        currency: props.budget.currency_iso,
    }).format(props.budget.balance)
});

function editBudget() {
    useModal().showModal(CreateEditBudget, {
        budget_id: props.budget.id,
        budget: props.budget,
    })
}

async function deleteBudget() {
    modal.value = true;

    const confirmed = await confirmationModal.value.ask();

    if (confirmed) {
        await useAPIOfetch(`/api/budgets/${props.budget.id}`, {
            method: "DELETE"
        }).then(() => {
            useNuxtApp().$bus.emit('refetch');
        }, (err) => {
            console.log(err);

            useModal().showModal(ErrorModal, {
                error: err
            })
        })
    }
}
</script>