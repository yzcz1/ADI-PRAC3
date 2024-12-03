<script setup>
import { ref, onMounted } from 'vue';
import { listarComentariosPorProducto, modificarComentario } from '@/repositories/commentRepository';
import NavBar from '@/components/NavBar.vue';
import UserIcon from '@/components/icons/UserIcon.vue'; // Icono de usuario
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const comentarios = ref([]);
const isLoading = ref(false);
const errorMessage = ref('');
const comentarioSeleccionado = ref(null); // Para almacenar el comentario seleccionado
const comentarioEnEdicion = ref(null); // Para almacenar el comentario que se está editando
const nuevoContenido = ref(''); // Contenido del comentario a editar
const editErrorMessage = ref(''); // Mensaje de error en edición
const editSuccessMessage = ref(''); // Mensaje de éxito en edición

const route = useRoute();
const router = useRouter();
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

// Función para cerrar el modal de detalles
const cerrarModal = () => {
  comentarioSeleccionado.value = null;
};

// Función para abrir el modo de edición
const editarComentario = (comentario) => {
  comentarioEnEdicion.value = comentario;
  nuevoContenido.value = comentario.contenido; // Prellenar el contenido existente
  editErrorMessage.value = '';
  editSuccessMessage.value = '';
};

// Función para guardar los cambios en el comentario
const guardarEdicion = async () => {
  if (!nuevoContenido.value.trim()) {
    editErrorMessage.value = 'El contenido del comentario no puede estar vacío.';
    return;
  }

  try {
    await modificarComentario(comentarioEnEdicion.value.id, nuevoContenido.value);
    comentarioEnEdicion.value.contenido = nuevoContenido.value;
    editSuccessMessage.value = 'Comentario editado con éxito.';
    setTimeout(() => {
      comentarioEnEdicion.value = null;
      cargarComentarios();
    }, 2000);
  } catch (error) {
    console.error('Error al editar comentario:', error.message);
    editErrorMessage.value = 'Hubo un error al editar el comentario.';
  }
};

// Función para cancelar la edición
const cancelarEdicion = () => {
  comentarioEnEdicion.value = null;
  nuevoContenido.value = '';
  editErrorMessage.value = '';
  editSuccessMessage.value = '';
};

// Formatear fecha
const formatDate = (timestamp) => {
  if (!timestamp) return 'Fecha no disponible';
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
        <!-- Botón Editar -->
        <button
          v-if="authStore.user?.isAdmin || authStore.user?.nombre === comentario.nombreUsuario"
          @click="editarComentario(comentario)"
          class="edit-button"
        >
          Editar
        </button>
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

    <!-- Modal de edición -->
    <div v-if="comentarioEnEdicion" class="modal-overlay" @click.self="cancelarEdicion">
      <div class="modal">
        <h2>Editar Comentario</h2>
        <textarea v-model="nuevoContenido" rows="5" placeholder="Edita tu comentario..."></textarea>
        <div v-if="editErrorMessage" class="error">{{ editErrorMessage }}</div>
        <div v-if="editSuccessMessage" class="success">{{ editSuccessMessage }}</div>
        <button @click="guardarEdicion" class="save-button">Guardar</button>
        <button @click="cancelarEdicion" class="cancel-button">Cancelar</button>
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

.success {
  text-align: center;
  font-size: 1.2rem;
  color: green;
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
  background: #007bff; /* Color actual del botón "Ver detalles" */
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 10px; /* Añadimos un margen inferior para separar los botones */
  transition: background 0.3s;
}

.view-details-button:hover {
  background: #0056b3;
}

.edit-button {
  background: #5bc0de; /* Azul claro profesional */
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

.edit-button:hover {
  background: #31b0d5; /* Azul un poco más oscuro al pasar el cursor */
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

textarea {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
  resize: none;
  font-size: 1rem;
  color: #333;
}

.save-button {
  background: #28a745;
  color: white;
  border: none;
  padding: 10px 20px;
  margin-right: 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

.save-button:hover {
  background: #218838;
}

.cancel-button {
  background: #dc3545;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

.cancel-button:hover {
  background: #c82333;
}

.close-modal-button {
  background: #ff5f5f;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

.close-modal-button:hover {
  background: #ff3333;
}
</style>
