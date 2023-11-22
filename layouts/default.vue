<template>
    <div class="w-screen h-screen flex flex-col">
        <!-- Show a navbar only if user is authenticated -->
        <NavBar v-if="isAuthenticated" />
        <slot />
    </div>

    <div id="modals"> </div>

    <!-- Dynamic modals -->
    <component v-for="(modal, i) in modals" :key="i" :is="modal.component" v-bind="modal.props" :model-value="true"
        @update:modelValue="hideModal" />
</template>

<script setup>
const { isAuthenticated } = useIsAuthenticated();
const { modals, hideModal } = useModal();
</script>

<style>
.page-enter-active,
.page-leave-active {
    transition: all 200ms ease-in-out;
}

.page-enter-from,
.page-leave-to {
    opacity: 0;
    filter: blur(1rem);
}
</style>