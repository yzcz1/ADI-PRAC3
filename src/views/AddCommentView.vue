<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { crearComentario } from '@/repositories/commentRepository';
import NavBar from '@/components/NavBar.vue';
import { useAuthStore } from '@/stores/auth';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const contenido = ref('');
const errorMessage = ref('');
const successMessage = ref('');
const isLoading = ref(false);

// Obtener los datos necesarios
const productoId = route.params.productoId; // ID del producto desde la ruta
const productoNombre = route.query.nombreProducto; // Nombre del producto desde los parámetros de consulta

// Manejo del envío del formulario
const handleCreateComment = async () => {
    if (!contenido.value.trim()) {
        errorMessage.value = 'El contenido del comentario es obligatorio.';
        return;
    }

    isLoading.value = true;
    errorMessage.value = '';
    successMessage.value = '';

    try {
        await crearComentario(
            productoId,
            authStore.user?.nombre || 'Usuario Anónimo', // Nombre del usuario
            contenido.value,
            productoNombre
        );

        successMessage.value = 'Comentario creado exitosamente.';
        contenido.value = ''; // Limpiar el campo de texto

        setTimeout(() => router.push(`/products`), 2000); // Redirigir después de 2 segundos
    } catch (error) {
        errorMessage.value = 'Error al crear el comentario. Por favor, inténtalo de nuevo.';
        console.error('Error al crear comentario:', error.message);
    } finally {
        isLoading.value = false;
    }
};
</script>

<template>
  <div class="add-comment-container">
    <NavBar :username="authStore.user?.email" />
    <h1>Añadir Comentario</h1>
    <p>Producto: <strong>{{ productoNombre }}</strong></p>

    <form @submit.prevent="handleCreateComment">
      <textarea
        v-model="contenido"
        placeholder="Escribe tu comentario aquí..."
        class="comment-textarea"
        rows="5"
        required
      ></textarea>

      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      <div v-if="successMessage" class="success-message">{{ successMessage }}</div>

      <button type="submit" :disabled="isLoading" class="submit-button">
        {{ isLoading ? 'Guardando...' : 'Añadir Comentario' }}
      </button>
    </form>
  </div>
</template>

<style scoped>
.add-comment-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

h1 {
  font-size: 1.8rem;
  color: #333;
}

.comment-textarea {
  width: 100%;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

button {
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #0056b3;
}

.error-message {
  color: red;
  margin-top: 1rem;
}

.success-message {
  color: green;
  margin-top: 1rem;
}
</style>
