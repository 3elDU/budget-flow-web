<template>
  <Suspense>
    <div>
      <!-- Show a navbar only if user is authenticated -->
      <NavBar v-if="isAuthenticated" />
      <RouterView />

      <div id="modals"></div>

      <!-- Dynamic modals -->
      <component
        v-for="(modal, i) in modals"
        :key="i"
        :is="modal.component"
        v-bind="modal.props"
        :model-value="true"
        @update:modelValue="hideModal"
      />
    </div>

    <template #fallback> Loading... </template>
  </Suspense>
</template>

<script setup>
import NavBar from "./components/NavBar.vue";
import { RouterView } from "vue-router";
import useIsAuthenticated from "./composables/useIsAuthenticated";
import useModal from "./composables/useModal";
const { isAuthenticated } = useIsAuthenticated();
const { modals, hideModal } = useModal();
</script>
