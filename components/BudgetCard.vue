<template>
    <div class="bg-primary rounded-lg flex flex-col p-3 gap-1" :style="{ backgroundColor: props.budget.color_hex }">
        <div class="text-lg font-bold">{{ props.budget.name }}</div>
        <div class="text-sm truncate" :title="props.budget.description">{{ props.budget.description }}</div>
        <div class="text-2xl font-black">{{ balance }}</div>

        <div class="flex mt-auto">
            <button class="w-full p-0.5 flex justify-center bg-success rounded-l-md">
                <Icon size="24" name="mdi:arrow-up" />
            </button>
            <button class="w-full p-0.5 flex justify-center bg-error">
                <Icon size="24" name="mdi:arrow-down" />
            </button>
            <button class="w-full p-0.5 flex justify-center bg-secondary" @click="editBudget">
                <Icon size="24" name="mdi:edit" />
            </button>
            <button class="w-full p-0.5 flex justify-center bg-error rounded-r-md" @click="deleteBudget()">
                <ModalsConfirmation ref="confirmationModal" v-model="modal" intent="Are you sure to delete this budget?" />
                <Icon size="24" :name="deleting ? 'line-md:loading-twotone-loop' : 'mdi:delete'" />
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
const deleting = ref(false);

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
    if (deleting.value) {
        return;
    }

    modal.value = true;

    const confirmed = await confirmationModal.value.ask();

    if (confirmed) {
        deleting.value = true;
        await useAPIOfetch(`/api/budgets/${props.budget.id}`, {
            method: "DELETE"
        }).then(() => {
            deleting.value = false;
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