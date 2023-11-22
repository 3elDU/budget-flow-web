<template>
    <Teleport to="#modals" v-if="modelValue">
        <div class="fixed inset-x-0 bottom-0 overflow-y-auto bg-black bg-opacity-50">
            <div ref="flexElement" @click="click($event)"
                class="flex justify-center sm:items-center items-end min-h-screen">
                <div class="bg-secondary sm:rounded-lg rounded-t-2xl max-w-md w-full p-6 shadow-xl" role="dialog"
                    aria-modal="true">
                    <slot />
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup>
const { persistent, modelValue, noTeleport } = defineProps({
    persistent: {
        type: Boolean,
        default: false,
    },
    modelValue: {
        type: Boolean
    }
});
const emit = defineEmits(['update:modelValue']);

const flexElement = ref();

defineExpose({ close });
function close() {
    emit('update:modelValue', false);
}

/**
 * @param {MouseEvent} event 
 */
function click(event) {
    // persistent modal must be explicitly closed
    if (persistent) {
        return;
    }

    // hide the modal only if clicked outside of the child
    if (event.target === flexElement.value) {
        emit('update:modelValue', false);
    }
}
</script>