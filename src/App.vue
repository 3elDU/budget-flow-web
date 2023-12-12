<template>
  <NavBar v-if="isAuthenticated" />

  <RouterView v-slot="{ Component }">
    <transition mode="out-in">
      <component :is="Component" />
    </transition>
  </RouterView>

  <Toast position="bottom-right" />
</template>

<script setup>
import { RouterView } from 'vue-router';
import { useUserStore } from '@/stores/userStore.js';
import { computed } from 'vue';
import NavBar from './components/NavBar.vue';
import Toast from 'primevue/toast';

const isAuthenticated = computed(() => useUserStore().isAuthenticated);
</script>
