<script setup>
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

const logout = async () => {
  try {
    await authStore.logout();
    window.location.href = '/';
  } catch (error) {
    alert('Error al cerrar sesión: ' + error.message);
  }
};
</script>

<template>
  <div class="welcome-container">
    <h1>Bienvenido a TrendyShop!</h1>
    <button @click="logout">Cerrar Sesión</button>
  </div>
</template>

<style scoped>
.welcome-container {
  text-align: center;
  padding: 2rem;
}

button {
  background-color: #f44336;
  color: #fff;
  padding: 0.7rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #e53935;
}
</style>
