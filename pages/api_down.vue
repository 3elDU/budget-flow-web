<template>
    <title>Connection lost</title>
    <div v-if="requestSucceeded" class="h-screen flex justify-center items-center">
        <div class="mx-8 break-word text-xl font-bold">
            Connection restored,<br>
            redirecting shortly.
        </div>
    </div>
    <div v-else class="h-screen flex flex-col justify-center items-center">
        <div class="mx-8 break-word text-xl font-bold">
            Request to the API has failed<br>
            There may be an issue with your network connectivity.<br>
        </div>

        <button @click="checkAPIConnectivity" class="btn-default w-fit mt-8"
            style="padding-left: 1.51rem; padding-right: 1.5rem">
            Check connectivity
        </button>
    </div>
</template>

<script setup>
const requestSucceeded = ref(false);

// Try to make a request each 10 seconds
const interval_id = setInterval(checkAPIConnectivity, 10_000);
await checkAPIConnectivity();

async function checkAPIConnectivity() {
    fetch(useRuntimeConfig().public.apiBaseUrl + '/api/users/me', {
        cache: 'no-cache',
        headers: {
            Authorization: `Bearer ${useAuthToken().authToken.value}`
        },
    })
        .catch((ctx) => {
            requestSucceeded.value = false;
        })
        .then((ctx) => {
            if (ctx?.status < 500) {
                requestSucceeded.value = true;
                clearInterval(interval_id);
                setTimeout(async () => {
                    await navigateTo('/');
                    location.reload();
                }, 1500);
            }
        });
}
</script>