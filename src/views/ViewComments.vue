<script setup>
import { ref, onMounted } from 'vue';
import { listarComentariosPorProducto } from '@/repositories/commentRepository';
import NavBar from '@/components/NavBar.vue';
import UserIcon from '@/components/icons/UserIcon.vue'; // Icono de usuario
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const comentarios = ref([]);
const isLoading = ref(false);
const errorMessage = ref('');

const route = useRoute();
const authStore = useAuthStore();
const productoId = route.params.productoId; // ID del producto
const nombreProducto = route.query.nombreProducto; // Nombre del producto

// Cargar comentarios para el producto
const cargarComentarios = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  try {
    const { comentarios: comentariosProducto } = await listarComentariosPorProducto(productoId, 10);
    comentarios.value = comentariosProducto;
  } catch (error) {
    console.error('Error al cargar comentarios:', error.message);
    errorMessage.value = 'Hubo un error al cargar los comentarios.';
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => cargarComentarios());


// Función de logout
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
  <div class="comments-container">
    <NavBar :username="authStore.user?.email" @logout="logout" />
    <h1>Comentarios sobre: {{ nombreProducto }}</h1>

    <div v-if="isLoading" class="loading">Cargando comentarios...</div>
    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>

    <div v-else class="comments-grid">
      <div v-for="comentario in comentarios" :key="comentario.id" class="comment-card">
        <p class="comment-content">{{ comentario.contenido }}</p>
        <div class="comment-footer">
          <UserIcon />
          <span class="comment-user">{{ comentario.nombreUsuario || 'Usuario Anónimo' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.comments-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 1rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #333;
}

.loading {
  text-align: center;
  font-size: 1.2rem;
  color: #007bff;
}

.error {
  text-align: center;
  font-size: 1.2rem;
  color: red;
}

.comments-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.comment-card {
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.comment-content {
  font-size: 1rem;
  color: #333;
  margin-bottom: 1rem;
}

.comment-footer {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.comment-user {
  font-size: 0.9rem;
  color: #666;
}
</style>
