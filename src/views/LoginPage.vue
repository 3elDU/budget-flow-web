<script setup>
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { useUserStore } from '@/stores/userStore.js';
import api from "@/plugins/api.js";

const router = useRouter();
const userStore = useUserStore();

// If the user is already authenticated, redirect to dashboard
if (userStore.isAuthenticated === true) {
  router.push('dashboard');
}

const form = ref(null);
const email = ref('');
const password = ref('');
const errors = ref([]);
const isLoading = ref(false);

async function login() {
  if (!form.value.reportValidity()) {
    return;
  }

  isLoading.value = true;

  const response = await api.post('auth/login', {
    email: email.value,
    password: password.value,
  });

  isLoading.value = false;

  if (response.status === 401) {
    // HTTP 401 Unauthorized
    errors.value = ['Invalid password'];

    return;
  } else if (response.status !== 200) {
    // Other HTTP status code
    errors.value = ['An error occurred. Please try again later.'];

    return;
  }

  const { token } = response.data;

  userStore.token = token;

  await userStore.fetchMe();

  await router.push('dashboard');
}
</script>

<template>
  <div
    class="h-screen flex justify-center items-center"
    @keydown.enter="login"
  >
    <div class="flex flex-col items-left mx-4 w-full max-w-[300px]">
      <h1 class="text-lg font-semibold mb-6">
        Login
      </h1>

      <form ref="form" class="flex flex-col gap-6">
        <span class="p-float-label">
          <InputText
            id="email"
            v-model="email"
            required
            class="w-full"
          />
          <label class="text-sm text-secondaryfg" for="email">E-mail</label>
        </span>

        <span class="p-float-label">
          <InputText
            id="password"
            v-model="password"
            required
            type="password"
            class="w-full"
          />
          <label class="text-sm text-secondaryfg" for="password">Password</label>
        </span>

        <ul v-if="errors.length > 0" class="mt-3 ml-4 list-disc">
          <li v-for="(error, i) in errors" :key="i" class="text-error">
            {{ error }}
          </li>
        </ul>

        <Button
          label="Login"
          type="button"
          :loading="isLoading"
          @click="login"
        />
      </form>
    </div>
  </div>
</template>
