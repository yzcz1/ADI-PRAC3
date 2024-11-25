<script setup>
import { ref, onMounted } from 'vue';
import { listarProductos } from '@/repositories/productRepository';
import NavBar from '@/components/NavBar.vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const productos = ref([]);
const currentPage = ref(1); // Página actual
const isLoading = ref(false); // Estado de carga
const hasMorePages = ref(true); // Indica si hay más páginas hacia adelante
const pageSnapshots = ref([]); // Array que almacena las referencias a cada página

const itemsPerPage = 6; // Número de productos por página

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
      <div class="product-card" v-for="producto in productos" :key="producto.id">
        <img :src="`/images/${producto.imagen}`" :alt="producto.nombre" class="product-image" />
        <h2 class="product-name">{{ producto.nombre }}</h2>
      </div>
    </div>

    <!-- Botones de paginación -->
    <div class="pagination">
      <button :disabled="currentPage === 1" @click="previousPage">Anterior</button>
      <span>Página {{ currentPage }}</span>
      <button :disabled="!hasMorePages" @click="nextPage">Siguiente</button>
    </div>
  </div>
</template>

<style scoped>
.product-list-container {
  padding: 2rem;
  margin-top: 4rem; /* Para que no choque con el navbar */
  text-align: center;
}

.title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 2rem;
  text-align: center;
  color: #333;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr); /* 2 productos por fila en pantallas medianas */
  }
}

@media (max-width: 480px) {
  .product-grid {
    grid-template-columns: 1fr; /* 1 producto por fila en pantallas pequeñas */
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

.pagination {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
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
</style>
