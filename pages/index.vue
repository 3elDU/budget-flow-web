<script setup>
const { isAuthenticated } = useIsAuthenticated();

if (isAuthenticated.value === true) {
    await navigateTo('/dashboard');
} else {
    await navigateTo('/login');
}
</script>