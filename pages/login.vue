<template>
    <div class="w-screen h-screen flex justify-center items-center" @keypress.enter="login">
        <Title>Login</Title>
        <div class="flex flex-col items-left mx-4 w-full max-w-[300px]">
            <h1 class="text-lg font-semibold">Login</h1>
            <form ref="form">
                <div class="mt-2">
                    <label class="block mb-1 text-sm text-secondaryfg" for="email">E-mail</label>
                    <input class="w-full input-default" v-model="email" name="email" type="email" required />
                </div>

                <div class="mt-6">
                    <label class="block mb-1 text-sm text-secondaryfg" for="password">Password</label>
                    <input class="w-full input-default" v-model="password" name="password" type="password" required>
                </div>

                <ul v-if="errors.length > 0" class="mt-3 ml-4 list-disc">
                    <li v-if="errors.length > 0" v-for="error in errors" class="text-error">
                        {{ error }}
                    </li>
                </ul>

                <div class="mt-6 text-right">
                    <button type="button" @click="login" class="btn-small px-5 py-1.5">Login</button>
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