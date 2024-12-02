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
const comentarioSeleccionado = ref(null); // Para almacenar el comentario seleccionado

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

// Función para mostrar los detalles del comentario en el modal
const verDetalles = (comentario) => {
  comentarioSeleccionado.value = comentario;
};

// Función para cerrar el modal
const cerrarModal = () => {
  comentarioSeleccionado.value = null;
};

// Formatear fecha
const formatDate = (timestamp) => {
  if (!timestamp) return "Fecha no disponible";
  const date = new Date(timestamp.seconds * 1000); // Firebase Timestamp -> JS Date
  return date.toLocaleString();
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
        <!-- Botón Ver detalles -->
        <button @click="verDetalles(comentario)" class="view-details-button">Ver detalles</button>
      </div>
    </div>

    <!-- Modal de detalles del comentario -->
    <div v-if="comentarioSeleccionado" class="modal-overlay" @click.self="cerrarModal">
      <div class="modal">
        <h2>Detalles del Comentario</h2>
        <p><strong>Producto ID:</strong> {{ comentarioSeleccionado.productoId }}</p>
        <p><strong>Producto Asociado:</strong> {{ comentarioSeleccionado.productoAsociado }}</p>
        <p><strong>Nombre Usuario:</strong> {{ comentarioSeleccionado.nombreUsuario }}</p>
        <p><strong>Fecha Creación:</strong> {{ formatDate(comentarioSeleccionado.fechaCreacion) }}</p>
        <p><strong>Contenido:</strong> {{ comentarioSeleccionado.contenido }}</p>
        <button @click="cerrarModal" class="close-modal-button">Cerrar</button>
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

/* Ajuste de la cuadrícula para mostrar filas de tres comentarios */
.comments-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

@media (max-width: 768px) {
  .comments-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .comments-grid {
    grid-template-columns: 1fr;
  }
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

.view-details-button {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
}

.view-details-button:hover {
  background: #0056b3;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.modal h2 {
  margin-top: 0;
}

.close-modal-button {
  background: #ff5f5f;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.close-modal-button:hover {
  background: #ff3333;
}
</style>
