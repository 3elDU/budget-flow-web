<script setup>
import { useMediaQuery, useThrottleFn } from '@vueuse/core';
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useUserStore } from '@/stores/userStore.js';
import router from '@/plugins/router.js';

const userStore = useUserStore();
const user = userStore.user;

if (!user) {
  userStore.fetchMe();
}

const links = [
  { name: 'Dashboard', to: '/dashboard', icon: 'pi pi-home' },
  { name: 'Analytics', to: '/analytics', icon: 'pi pi-chart-bar' },
  { name: 'Operations', to: '/operations', icon: 'pi pi-dollar' },
  { name: 'Categories', to: '/categories', icon: 'pi pi-tags' },
  { name: 'Settings', to: '/profile', icon: 'pi pi-cog' },
];

const largeScreen = useMediaQuery("(min-width: 1280px)");
const isSidebarOpen = ref(false);

const toggleSidebar = useThrottleFn(() => {
  isSidebarOpen.value = !isSidebarOpen.value;
}, 350);
</script>

<template>
  <nav
    v-if="largeScreen"
    class="bg-secondary flex flex-row px-6 py-2.5 gap-6 font-bold items-center"
  >
    <RouterLink to="/dashboard" class="flex flex-row">
      <div class="text-2xl">
        Budget-Flow
      </div>
    </RouterLink>

    <div class="flex flex-row pl-6 gap-4">
      <Button
        v-for="link in links"
        :key="link.name"
        link
        :icon="link.icon"
        :label="link.name"
        :class="{
          'bg-primary': router.currentRoute.value.path === link.to,
          'bg-secondary': router.currentRoute.value.path !== link.to,
        }"
        class="px-4 py-2 rounded-lg text-white font-bold text-sm"
        @click="router.push(link.to)"
      />
    </div>

    <div class="ml-auto flex flex-row pr-6 gap-6 items-center">
      <div class="max-w-[10rem] truncate text-sm">
        {{ user?.name }}
      </div>

      <Button
        link
        class="px-4 py-2 rounded-lg text-white font-bold whitespace-nowrap flex-none text-sm"
        @click="userStore.logout"
      >
        Log out
      </Button>
    </div>
  </nav>

  <div v-else class="mb-16 relative">
    <div class="fixed top-0 z-30 w-full h-16 bg-primarybg" />

    <button class="fixed z-50 top-4 left-4" @click="toggleSidebar">
      <i v-if="isSidebarOpen" class="pi pi-bars text-xl" />
      <i v-else class="pi pi-times text-xl" />
    </button>

    <Transition name="sidebar">
      <nav
        v-if="isSidebarOpen"
        class="fixed inset-0 z-40 w-full sm:max-w-sm h-full bg-secondary shadow-2xl flex flex-col px-6 pt-4 gap-6 font-bold text-2xl"
      >
        <div class="ml-auto">
          <RouterLink to="/profile" :title="user.email" @click="toggleSidebar">
            {{ user?.name }}
          </RouterLink>
        </div>

        <RouterLink
          v-for="link in links"
          :key="link.name"
          :to="link.to"
          @click="toggleSidebar"
        >
          {{ link.name }}
        </RouterLink>

        <div class="mt-8 flex flex-col gap-6 justify-left">
          <button @click="userStore.logout">
            Log out
          </button>
        </div>
      </nav>
    </Transition>
  </div>
</template>

<style scoped>
.sidebar-enter-active,
.sidebar-leave-active {
  transition: transform 0.3s ease-in-out;
}

.sidebar-enter-from,
.sidebar-leave-to {
  transform: translateX(-100%);
}

.sidebar-enter-to,
.sidebar-leave-from {
  transform: translateX(0);
}
</style>
