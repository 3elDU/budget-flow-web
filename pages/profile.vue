<template>
    <div class="px-5 flex flex-col items-center md:items-start">
        <Title>Profile</Title>

        <h1 class="font-bold text-3xl mb-4">{{ user.name }}</h1>

        <form class="w-full max-w-[350px] grid grid-cols-1 gap-4">
            <label class="block">
                <span for="preferred_currency" class="text-sm">Preferred currency</span>
                <select :disabled="!editing" class="select-default mt-1 w-full" name="preferred_currency"
                    v-model="preferredCurrency">
                    <option v-for="currency in currenciesList" :value="currency">
                        {{ currency }}
                    </option>
                </select>
            </label>

            <label class="inline-flex items-center">
                <input :disabled="!editing" class="checkbox-default mr-1" type="checkbox" name="show_fractional"
                    v-model="showFractionalNumbers">
                <span class="ml-1 text-sm" for="show_fractional">Show fractional numbers</span>
            </label>

            <div class="relative ml-auto md:ml-0 mt-4 flex">
                <Transition name="fade">
                    <div v-if="editing" class="flex gap-2">
                        <button class="btn-default" @click.prevent="saveChanges">
                            <Icon name="mdi:content-save" />
                            Save
                        </button>
                        <button class="btn-default !bg-error" @click.prevent="editing = false">
                            <Icon name="mdi:delete" />
                            Cancel
                        </button>
                    </div>
                    <button v-else class="btn-default" @click.prevent="editing = true">
                        <Icon name="mdi:edit" />
                        Edit
                    </button>
                </Transition>
            </div>
        </form>
    </div>
</template>

<script setup>
const user = await useAuthUser();
const { data: settings } = await useAPIFetch('/api/users/me/settings');

const editing = ref(false);
const preferredCurrency = ref(settings.value.preferred_currency_iso);
const showFractionalNumbers = ref(settings.value.show_fractional);

const currenciesList = [
    'USD',
    'EUR',
    'UAH'
];

async function saveChanges() {
    await useAPIFetch('/api/users/me/settings', {
        method: 'PUT', body: {
            preferred_currency_iso: preferredCurrency.value,
            show_fractional: showFractionalNumbers.value
        }
    });
    editing.value = false;
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: all 200ms ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.fade-leave-active {
    position: absolute;
}

@media (max-width: 768px) {
    .fade-leave-active {
        right: 0;
    }
}
</style>
