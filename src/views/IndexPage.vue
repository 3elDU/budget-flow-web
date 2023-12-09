<script setup>
import { useUserStore } from '@/stores/userStore.js';
import router from '@/plugins/router.js';
import { onMounted } from 'vue';

const userStore = useUserStore();

onMounted(() => {
  if (userStore.isAuthenticated === true) {
    router.push('dashboard');
  } else {
    router.push('login');
  }
});
</script>
