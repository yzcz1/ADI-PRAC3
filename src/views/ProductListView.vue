<script setup>
import { ref, onMounted } from 'vue';
import { listarProductos, eliminarProducto } from '@/repositories/productRepository';
import NavBar from '@/components/NavBar.vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useCartStore } from '@/stores/cart'; // Store para el carrito

const router = useRouter();
const authStore = useAuthStore();
const cartStore = useCartStore(); // Store del carrito

const productos = ref([]);
const currentPage = ref(1); // Página actual
const isLoading = ref(false); // Estado de carga
const hasMorePages = ref(true); // Indica si hay más páginas hacia adelante
const pageSnapshots = ref([]); // Array que almacena las referencias a cada página

const selectedProduct = ref(null); // Producto seleccionado para ver detalles
const showDetails = ref(false); // Estado para mostrar detalles del producto

const itemsPerPage = 6; // Número de productos por página

// Estado para los mensajes de éxito y error
const successMessages = ref({});
const errorMessages = ref({});

// Función para cargar productos
const loadProductos = async (pagina) => {
  isLoading.value = true;

  try {
    let lastVisible = null;

    // Determinar la referencia de la página
    if (pagina > 1 && pageSnapshots.value[pagina - 2]) {
      lastVisible = pageSnapshots.value[pagina - 2];
    }

    const { productos: nuevosProductos, lastVisible: nuevoLastVisible } =
      await listarProductos(itemsPerPage, lastVisible);

    productos.value = nuevosProductos;

    // Guardar la referencia del último documento para la página actual
    if (pagina > pageSnapshots.value.length) {
      pageSnapshots.value.push(nuevoLastVisible);
    }

    // Actualizar el estado de paginación
    hasMorePages.value = nuevosProductos.length === itemsPerPage;
    currentPage.value = pagina;
  } catch (error) {
    console.error('Error al cargar productos:', error.message);
  } finally {
    isLoading.value = false;
  }
};

// Función para mostrar detalles de un producto
const viewDetails = (producto) => {
  selectedProduct.value = producto; // Guardar el producto seleccionado
  showDetails.value = true; // Mostrar el modal de detalles
};

// Función para cerrar el modal de detalles
const closeDetails = () => {
  showDetails.value = false;
  selectedProduct.value = null;
};

// Redirigir a la vista de edición de producto
const editProduct = (productId) => {
  router.push(`/products/edit/${productId}`); // Navegar a la vista de edición
};

// Función para eliminar un producto con animación
const deleteProduct = async (productId) => {
  try {
    const productIndex = productos.value.findIndex((producto) => producto.id === productId);
    if (productIndex !== -1) {
      productos.value[productIndex].isBeingDeleted = true; // Activar la animación solo en el producto específico
      setTimeout(async () => {
        await eliminarProducto(productId); // Eliminar de la base de datos
        productos.value.splice(productIndex, 1); // Eliminar de la vista
      }, 300); // Tiempo de la animación antes de eliminar el producto
    }
  } catch (error) {
    console.error('Error al eliminar producto:', error.message);
    alert('Hubo un error al eliminar el producto.');
  }
};

// Función para añadir producto al carrito
const addToCart = (producto) => {
  const wasAdded = cartStore.addToCart(producto); // Llama al store para añadir el producto
  if (wasAdded) {
    successMessages.value[producto.id] = `Producto añadido al carrito exitosamente.`;
  } else {
    errorMessages.value[producto.id] = `Ya has añadido este producto a tu carrito.`;
  }

  // Ocultar el mensaje de éxito después de 5 segundos
  setTimeout(() => {
    delete successMessages.value[producto.id];
    delete errorMessages.value[producto.id];
  }, 5000);
};

// Al montar el componente, cargar la primera página
onMounted(() => loadProductos(1));

// Función para ir a la página siguiente
const nextPage = async () => {
  if (hasMorePages.value) {
    await loadProductos(currentPage.value + 1);
  }
};

// Función para volver a la página anterior
const previousPage = async () => {
  if (currentPage.value > 1) {
    await loadProductos(currentPage.value - 1);
  }
};

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
  <NavBar :username="authStore.user?.email" @logout="logout" />
  <div class="product-list-container">
    <h1 class="title">Nuestros productos</h1>
    <div class="product-grid">
      <div
        v-for="producto in productos"
        :key="producto.id"
        class="product-card"
        :class="{ deleting: producto.isBeingDeleted }"
      >
        <img :src="`/images/${producto.imagen}`" :alt="producto.nombre" class="product-image" />
        <h2 class="product-name">{{ producto.nombre }}</h2>

        <!-- Contenedor de botones -->
        <div class="product-buttons">
          <!-- Botón de Ver Detalles -->
          <button class="product-button details-button" @click="viewDetails(producto)">Ver Detalles</button>

          <!-- Botón de editar visible solo para administradores -->
          <button
            v-if="authStore.user?.isAdmin"
            class="product-button edit-button"
            @click="editProduct(producto.id)"
          >
            Editar
          </button>

          <!-- Botón de borrar visible solo para administradores -->
          <button
            v-if="authStore.user?.isAdmin"
            class="product-button delete-button"
            @click="deleteProduct(producto.id)"
          >
            Borrar
          </button>

          <!-- Botón Añadir Comentario -->
          <button
            class="product-button add-comment-button"
            @click="router.push({ name: 'AddComment', params: { productoId: producto.id }, query: { nombreProducto: producto.nombre } })"
          >
            Añadir Comentario
          </button>

          <!-- Botón Ver Comentarios -->
          <button
            class="product-button view-comments-button"
            @click="router.push({ name: 'ViewComments', params: { productoId: producto.id }, query: { nombreProducto: producto.nombre } })"
          >
            Ver Comentarios
          </button>

          <!-- Botón Añadir al carrito -->
          <button class="product-button cart-button" @click="addToCart(producto)">
            Añadir al carrito
          </button>

          <!-- Mensajes -->
          <p v-if="successMessages[producto.id]" class="success-message">{{ successMessages[producto.id] }}</p>
          <p v-if="errorMessages[producto.id]" class="error-message">{{ errorMessages[producto.id] }}</p>
        </div>
      </div>
    </div>

    <!-- Botones de paginación -->
    <div class="pagination">
      <button :disabled="currentPage === 1" @click="previousPage">Anterior</button>
      <span>Página {{ currentPage }}</span>
      <button :disabled="!hasMorePages" @click="nextPage">Siguiente</button>
    </div>
  </div>

  <!-- Modal para mostrar los detalles del producto -->
  <div v-if="showDetails" class="details-modal">
    <div class="modal-content">
      <button class="close-button" @click="closeDetails">X</button>
      <img :src="`/images/${selectedProduct.imagen}`" :alt="selectedProduct.nombre" class="modal-image" />
      <h2>{{ selectedProduct.nombre }}</h2>
      <p><strong>Categoría:</strong> {{ selectedProduct.categoria }}</p>
      <p><strong>Precio:</strong> €{{ selectedProduct.precio.toFixed(2) }}</p>
      <p><strong>Descripción:</strong> {{ selectedProduct.descripcion }}</p>
    </div>
  </div>
</template>

<style scoped>
.product-list-container {
  padding: 2rem;
  margin-top: 4rem;
  text-align: center;
}

.title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 2rem;
  color: #333;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .product-grid {
    grid-template-columns: 1fr;
  }
}

.product-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.product-card.deleting {
  opacity: 0;
  transform: scale(0.9);
  transition: all 0.3s ease;
}

.product-card:hover {
  transform: scale(1.05);
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
}

.product-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-bottom: 1px solid #ddd;
}

.product-name {
  font-size: 1.2rem;
  font-weight: bold;
  margin: 1rem 0;
  color: #333;
}

/* Contenedor de botones */
.product-buttons {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.5rem;
  margin: 0.5rem 1rem;
}

/* Estilos comunes para todos los botones */
.product-button {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

/* Botón Ver Detalles */
.details-button {
  background-color: #6a0dad;
  color: white;
}

.details-button:hover {
  background-color: #5a0c9a;
}

/* Botón Añadir Comentario */
.add-comment-button {
  background-color: white;
  color: black;
  border: 1px solid #ccc;
}

.add-comment-button:hover {
  background-color: #f0f0f0;
}

/* Botón Ver Comentarios */
.view-comments-button {
  background-color: #4da6ff;
  color: white;
}

.view-comments-button:hover {
  background-color: #3399ff;
}

/* Botón Editar */
.edit-button {
  padding: 0.5rem 1rem;
  background-color: #ffc107;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.edit-button:hover {
  background-color: #e0a800;
}

/* Botón Borrar */
.delete-button {
  padding: 0.5rem 1rem;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.delete-button:hover {
  background-color: #bd2130;
}

/* Botón Añadir al carrito */
.cart-button {
  background-color: #28a745;
  color: white;
}

.cart-button:hover {
  background-color: #218838;
}

/* Mensajes */
.success-message {
  margin-top: 0.5rem;
  color: #155724;
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
  padding: 0.5rem;
  border-radius: 4px;
  font-size: 0.9rem;
  text-align: center;
}

.error-message {
  margin-top: 0.5rem;
  color: #721c24;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  padding: 0.5rem;
  border-radius: 4px;
  font-size: 0.9rem;
  text-align: center;
}

/* Paginación */
.pagination {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.pagination button {
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* Modal para Detalles del Producto */
.details-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  position: relative;
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 400px;
  width: 90%;
  text-align: center;
}

.modal-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  cursor: pointer;
}

.close-button:hover {
  color: red;
}
</style>
