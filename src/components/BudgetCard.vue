<template>
    <div class="bg-primary rounded-lg flex flex-col p-3 gap-1" :style="{ backgroundColor: props.budget.color_hex }">
        <div class="text-lg font-bold truncate" :title="props.budget.name">{{ props.budget.name }}</div>
        <div class="text-sm truncate" :title="props.budget.description">{{ props.budget.description }}</div>
        <div class="text-2xl font-black">{{ balance }}</div>

        <div class="flex mt-auto">
            <button class="w-full p-0.5 flex justify-center bg-success rounded-l-md">
                <IconMdiArrowUp font-size="24" />
            </button>
            <button class="w-full p-0.5 flex justify-center bg-error">
                <IconMdiArrowDown font-size="24" />
            </button>
            <button class="w-full p-0.5 flex justify-center bg-secondary" @click="editBudget">
                <IconMdiEdit font-size="24" />
            </button>
            <button class="w-full p-0.5 flex justify-center bg-error rounded-r-md" @click="deleteBudget()">
                <ModalsConfirmation ref="confirmationModal" v-model="modal" intent="Are you sure to delete this budget?" />
                <IconLineMdLoadingTwotoneLoop v-if="deleting" font-size="24" />
                <IconMdiDelete v-else font-size="24" />
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, inject, computed } from 'vue';
import useModal from '../composables/useModal';
import { useAPIOfetch } from '../composables/useAPIFetch';
import CreateEditBudget from './modals/CreateEditBudget.vue';
import Error from './modals/Error.vue';

const bus = inject('bus');
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
            bus.emit('refetch');
        }, (err) => {
            console.log(err);

            useModal().showModal(Error, {
                error: err
            })
        }).finally(() => {
            deleting.value = false;
        })
    }
}
</script>