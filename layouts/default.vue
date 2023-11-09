<template>
    <div class="w-screen h-screen flex flex-col">
        <!-- Show a navbar only if user is authenticated -->
        <NavBar v-if="isAuthenticated" />
        <slot />
    </div>
</template>

<script setup>
const { isAuthenticated } = useIsAuthenticated();
</script>

<style>
.page-enter-active,
.page-leave-active {
    transition: all 200ms;
}

.page-enter-from,
.page-leave-to {
    opacity: 0;
    filter: blur(1rem);
}
</style>