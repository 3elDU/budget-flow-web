<script setup>
import router from '@/plugins/router.js';
</script>

<template>
  <div class="flex flex-col justify-center items-center gap-4 h-full">
    <p class="text-5xl font-black">404</p>
    <h1 class="text-3xl font-bold">Page not found</h1>
    <Button @click="router.push('/dashboard')" label="Home" />
  </div>
</template>