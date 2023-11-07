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