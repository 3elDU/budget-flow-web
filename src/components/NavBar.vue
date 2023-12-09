<template>
  <nav
    v-if="largeScreen"
    class="bg-secondary flex flex-row px-6 py-2.5 gap-6 font-bold items-center"
  >
    <RouterLink to="/dashboard" class="flex flex-row">
      <div class="text-2xl">Budget-Flow</div>
    </RouterLink>

    <div class="flex flex-row pl-6 gap-6">
      <Button
        v-for="link in links"
        :key="link.name"
        @click="router.push(link.to)"
        link
        :class="{
          'bg-primary': $route.path === link.to,
          'bg-secondary': $route.path !== link.to,
        }"
        class="px-4 py-2 rounded-lg text-white font-bold"
      >
        {{ link.name }}
      </Button>
    </div>

    <div class="ml-auto flex flex-row pr-6 gap-12 items-center">
      <div>{{ user.name }}</div>

      <Button link @click="userStore.logout" class="px-4 py-2 rounded-lg text-white font-bold">
        Log out
      </Button>
    </div>
  </nav>

  <div v-else class="mb-16 relative">
    <div class="fixed top-0 z-30 w-full h-16 bg-primarybg" />

    <button @click="toggleSidebar" class="fixed z-50 top-4 left-4">
      <IconMdiClose v-if="isSidebarOpen" width="32" height="32" />
      <IconMdiMenu v-else width="32" height="32" />
    </button>

    <Transition name="sidebar">
      <nav
        v-if="isSidebarOpen"
        class="fixed inset-0 z-40 w-full sm:max-w-sm h-full bg-secondary shadow-2xl flex flex-col px-6 pt-4 gap-6 font-bold text-2xl"
      >
        <div class="ml-auto">
          <RouterLink to="/profile" :title="user.email" @click="toggleSidebar">
            {{ user.name }}
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
          <button @click="userStore.logout">Log out</button>
        </div>
      </nav>
    </Transition>
  </div>
</template>

<script setup>
import { useMediaQuery, useThrottleFn } from '@vueuse/core';
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useUserStore } from '@/stores/userStore.js';
import router from "@/plugins/router.js";

const userStore = useUserStore();
const user = userStore.user;

if (!user) {
  userStore.fetchMe();
}

const links = [
  { name: 'Dashboard', to: '/dashboard' },
  { name: 'Analytics', to: '/analytics' },
  { name: 'Operations', to: '/operations' },
  { name: 'Settings', to: '/profile' },
];

const items = ref([
  {
    label: 'Router',
    icon: 'pi pi-palette',
    items: [
      {
        label: 'Styled',
        route: '/theming'
      },
      {
        label: 'Unstyled',
        route: '/unstyled'
      }
    ]
  },
  {
    label: 'Programmatic',
    icon: 'pi pi-link',
    command: () => {
      router.push('/installation');
    }
  },
]);

const largeScreen = useMediaQuery("(min-width: 1280px)");
const isSidebarOpen = ref(false);

const toggleSidebar = useThrottleFn(() => {
  isSidebarOpen.value = !isSidebarOpen.value;
}, 350);
</script>

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
