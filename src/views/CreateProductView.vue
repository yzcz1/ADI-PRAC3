<script setup>
import { ref } from 'vue';
import NavBar from '@/components/NavBar.vue';
import { useRouter } from 'vue-router';
import { createProducto } from '@/repositories/productRepository';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const router = useRouter();

// Campos del formulario
const nombre = ref('');
const categoria = ref('');
const precio = ref('');
const descripcion = ref('');

// Mensajes y estados
const errorMessage = ref('');
const successMessage = ref('');
const isLoading = ref(false);

// Validación del formulario
const validateForm = () => {
  if (!nombre.value.trim()) {
    errorMessage.value = 'El nombre del producto es obligatorio.';
    return false;
  }
  if (!categoria.value.trim()) {
    errorMessage.value = 'La categoría es obligatoria.';
    return false;
  }
  if (!precio.value || isNaN(precio.value) || precio.value <= 0) {
    errorMessage.value = 'El precio debe ser un número mayor a 0.';
    return false;
  }
  if (!descripcion.value.trim()) {
    errorMessage.value = 'La descripción es obligatoria.';
    return false;
  }
  return true;
};

// Manejo del envío del formulario
const handleCreateProduct = async () => {
  if (!validateForm()) return;

  isLoading.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    await createProducto(nombre.value, categoria.value, parseFloat(precio.value), descripcion.value);
    successMessage.value = 'Producto creado exitosamente.';
    // Limpiar campos después de crear el producto
    nombre.value = '';
    categoria.value = '';
    precio.value = '';
    descripcion.value = '';

    // Redirigir al usuario a otra vista si es necesario (opcional)
    setTimeout(() => router.push('/welcome'), 2000);
  } catch (error) {
    errorMessage.value = 'Error al crear el producto. Por favor, inténtalo de nuevo.';
    console.error('Error al crear el producto:', error.message);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
    <NavBar :username="authStore.user?.email" @logout="logout" />
  <div class="create-product-container">
    <h1>Crear Producto</h1>
    <form @submit.prevent="handleCreateProduct" class="form">
      <!-- Campo Nombre -->
      <div class="form-group">
        <label for="nombre">Nombre</label>
        <input id="nombre" v-model="nombre" type="text" placeholder="Nombre del producto" required />
      </div>

      <!-- Campo Categoría -->
      <div class="form-group">
        <label for="categoria">Categoría</label>
        <input id="categoria" v-model="categoria" type="text" placeholder="Categoría" required />
      </div>

      <!-- Campo Precio -->
      <div class="form-group">
        <label for="precio">Precio (€)</label>
        <input id="precio" v-model="precio" type="number" placeholder="Precio" required min="0.01" step="0.01" />
      </div>

      <!-- Campo Descripción -->
      <div class="form-group">
        <label for="descripcion">Descripción</label>
        <textarea id="descripcion" v-model="descripcion" placeholder="Descripción del producto" required></textarea>
      </div>

      <!-- Mensajes -->
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      <div v-if="successMessage" class="success-message">{{ successMessage }}</div>

      <!-- Botón Crear -->
      <button type="submit" :disabled="isLoading" class="create-button">
        {{ isLoading ? 'Creando...' : 'Crear Producto' }}
      </button>
    </form>
  </div>
</template>

<style scoped>
.create-product-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

h1 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 1.5rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  text-align: left;
}

label {
  font-size: 1rem;
  color: #333;
  margin-bottom: 0.5rem;
}

input,
textarea {
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.3s ease;
}

input:focus,
textarea:focus {
  border-color: #007bff;
  outline: none;
}

textarea {
  resize: vertical;
  min-height: 100px;
}

button {
  padding: 0.75rem;
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

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.error-message {
  color: #d9534f;
  font-size: 0.9rem;
}

.success-message {
  color: #5cb85c;
  font-size: 0.9rem;
}
</style>
