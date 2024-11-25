<template>
    <NavBar :username="authStore.user?.email" @logout="logout" />
    <div class="edit-product-view">
      <h1>Editar Producto</h1>
      <form @submit.prevent="updateProduct">
        <div class="form-group">
          <label>Nombre</label>
          <input v-model="nombre" type="text" />
        </div>
        <div class="form-group">
          <label>Categoría</label>
          <input v-model="categoria" type="text" />
        </div>
        <div class="form-group">
          <label>Precio</label>
          <input v-model="precio" type="number" step="0.01" />
        </div>
        <div class="form-group">
          <label>Descripción</label>
          <textarea v-model="descripcion"></textarea>
        </div>
        <div class="form-group">
          <label>Imagen</label>
          <input v-model="imagen" type="text" />
        </div>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
        <button type="submit" :disabled="isLoading">{{ isLoading ? 'Guardando...' : 'Guardar Cambios' }}</button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import NavBar from '@/components/NavBar.vue';
  import { useAuthStore } from '@/stores/auth';
  import { useRoute, useRouter } from 'vue-router';
  import { obtenerProducto, modificarProducto } from '@/repositories/productRepository';
  
  const route = useRoute();
  const router = useRouter();
  const authStore = useAuthStore();
  
  // Variables reactivas para los campos del formulario
  const nombre = ref('');
  const categoria = ref('');
  const precio = ref(0);
  const descripcion = ref('');
  const imagen = ref('');
  const isLoading = ref(false);
  const errorMessage = ref('');
  
  // Al montar la vista, obtener el producto
  onMounted(async () => {
    const productId = route.params.id; // Obtener el ID del producto de la ruta
    try {
      const product = await obtenerProducto(productId);
      if (product) {
        nombre.value = product.nombre || '';
        categoria.value = product.categoria || '';
        precio.value = product.precio || 0;
        descripcion.value = product.descripcion || '';
        imagen.value = product.imagen || '';
      } else {
        console.error('Producto no encontrado:', productId);
        router.push('/products'); // Redirigir si no se encuentra el producto
      }
    } catch (error) {
      console.error('Error al obtener producto:', error.message);
      router.push('/products'); // Redirigir en caso de error
    }
  });

  // Función de logout
const logout = async () => {
  try {
    await authStore.logout();
    window.location.href = '/';
  } catch (error) {
    alert('Error al cerrar sesión: ' + error.message);
  }
};
  
  // Función para actualizar el producto
  const updateProduct = async () => {
    if (!nombre.value.trim() || !categoria.value.trim() || !descripcion.value.trim() || !precio.value || !imagen.value) {
      errorMessage.value = 'Todos los campos son obligatorios.';
      return;
    }
  
    isLoading.value = true;
    errorMessage.value = '';
  
    try {
      await modificarProducto(route.params.id, {
        nombre: nombre.value,
        categoria: categoria.value,
        precio: parseFloat(precio.value),
        descripcion: descripcion.value,
        imagen: imagen.value,
      });
  
      console.log('Producto actualizado con éxito');
      router.push('/products'); // Redirigir a la lista de productos tras guardar
    } catch (error) {
      errorMessage.value = 'Error al actualizar el producto.';
      console.error('Error al actualizar producto:', error.message);
    } finally {
      isLoading.value = false;
    }
  };
  </script>
  
  <style scoped>
  .edit-product-view {
    padding: 2rem;
    max-width: 600px;
    margin: 0 auto;
  }
  
  h1 {
    text-align: center;
    margin-bottom: 1.5rem;
  }
  
  .form-group {
    margin-bottom: 1rem;
  }
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: bold;
  }
  
  input,
  textarea {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  button {
    padding: 0.5rem 1rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  
  .error {
    color: red;
    margin-top: 1rem;
  }
  </style>
  