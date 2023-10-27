<template>
    <title>Login</title>
    <div id="wrapper">
        <div id="container" class="mx-4 w-full max-w-[300px]">
            <h1 class="text-lg font-semibold">Login</h1>
            <form ref="form">
                <div class="mt-2">
                    <label class="block mb-1 text-sm font-medium text-slate-700" for="email">E-mail</label>
                    <input
                        class="w-full px-3 py-2 text-sm font-semibold rounded-md bg-white border border-slate-300 focus:border-sky-500 invalid:border-pink-500 invalid:text-pink-500"
                        v-model="email" name="email" type="email" required />
                </div>

                <div class="mt-6">
                    <label class="block mb-1 text-sm font-medium text-slate-700" for="password">Password</label>
                    <input
                        class="w-full px-3 py-2 text-sm rounded-md bg-white border border-slate-300 focus:border-sky-500 invalid:border-pink-500 invalid:text-pink-500"
                        v-model="password" name="password" type="password" required>
                </div>

                <ul v-if="errors.length > 0" class="mt-3 ml-4 list-disc">
                    <li v-if="errors.length > 0" v-for="error in errors" class="text-pink-500">
                        {{ error }}
                    </li>
                </ul>

                <div class="mt-6 text-right">
                    <button type="button" @click="login"
                        class="px-5 py-1.5 text-white font-semibold bg-sky-500 hover:bg-sky-700 rounded-md">Login</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
const { setAuthToken } = useAuthToken()
const { isAuthenticated, setIsAuthenticated } = useIsAuthenticated();

// If the user is already authenticated, redirect to dashboard
if (isAuthenticated.value === true) {
    await navigateTo('/dashboard');
}

const form = ref(null);
const email = ref('');
const password = ref('');
const errors = ref([]);

async function login() {
    if (!form.value.reportValidity()) {
        return;
    }

    const response = await fetch(useRuntimeConfig().public.apiBaseUrl + '/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            email: email.value,
            password: password.value
        })
    });
    const body = await response.json();

    if (!response.ok) {
        if (response.status === 401) { // HTTP 401 Unauthorized
            errors.value = ["Invalid password"];
        } else if (Object.hasOwn(body, 'errors')) {
            errors.value = [];
            Object.values(body.errors).map(field =>
                Object.values(field).map(error => errors.value.push(error))
            );
        }
    } else {
        setAuthToken(body.token);
        setIsAuthenticated(true);

        await navigateTo('/dashboard');
    }
}
</script>

<style>
#wrapper {
    width: 100dvw;
    height: 100dvh;

    display: flex;
    justify-content: center;
    align-items: center;
}

#container {
    display: flex;
    flex-direction: column;
    align-items: left;
}
</style>