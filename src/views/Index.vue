<script setup>
import { useRouter } from 'vue-router';
import useIsAuthenticated from '../composables/useIsAuthenticated';
const { isAuthenticated } = useIsAuthenticated();
const router = useRouter();

if (isAuthenticated.value === true) {
    router.push('dashboard');
} else {
    router.push('login');
}
</script>