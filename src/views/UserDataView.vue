<script setup>
import NavBar from '@/components/NavBar.vue';
import { useAuthStore } from '@/stores/auth';
import { ref, onMounted } from 'vue';
import { getUserData } from '@/services/userService'; // Función para obtener los datos del usuario

const authStore = useAuthStore();
const userData = ref(null); // Datos del usuario
const isLoading = ref(true); // Indicador de carga

const logout = async () => {
  try {
    await authStore.logout();
    window.location.href = '/';
  } catch (error) {
    alert('Error al cerrar sesión: ' + error.message);
  }
};

// Cargar datos del usuario al montar el componente
onMounted(async () => {
  try {
    const userId = authStore.user?.uid;
    if (userId) {
      userData.value = await getUserData(userId);
    }
  } catch (error) {
    console.error('Error al obtener los datos del usuario:', error.message);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="user-data-background">
    <!-- NavBar -->
    <NavBar :username="authStore.user?.email" @logout="logout" />

    <div class="user-data-container">
      <h1>Mis Datos</h1>

      <!-- Indicador de carga -->
      <div v-if="isLoading" class="loading">
        Cargando datos del usuario...
      </div>

      <!-- Tabla con los datos del usuario -->
      <div v-else>
        <table class="user-data-table">
          <thead>
            <tr>
              <th>Campo</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Email</td>
              <td>{{ userData?.email || 'No disponible' }}</td>
            </tr>
            <tr>
              <td>Nombre</td>
              <td>{{ userData?.nombre || 'No disponible' }}</td>
            </tr>
            <tr>
              <td>Apellidos</td>
              <td>{{ userData?.apellidos || 'No disponible' }}</td>
            </tr>
            <tr>
              <td>Edad</td>
              <td>{{ userData?.edad || 'No disponible' }}</td>
            </tr>
            <tr>
              <td>Rol</td>
              <td>{{ userData?.rol || 'Usuario' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.user-data-background {
  min-height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 6rem; /* Espacio para que no tape el navbar */
}

.user-data-container {
  max-width: 800px;
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  margin-top: 2rem;
}

h1 {
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 1.5rem;
}

.loading {
  font-size: 1.2rem;
  color: #666;
}

.user-data-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1.5rem;
}

.user-data-table th,
.user-data-table td {
  padding: 0.8rem;
  text-align: left;
  border: 1px solid #ddd;
}

.user-data-table th {
  background-color: #333;
  color: white;
  font-weight: bold;
}

.user-data-table td {
  background-color: #f9f9f9;
  color: #333;
}

.user-data-table tr:hover td {
  background-color: #f1f1f1;
}
</style>
