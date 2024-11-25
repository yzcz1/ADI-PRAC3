<script setup>
import { ref, onMounted } from 'vue';
import { listarProductos } from '@/repositories/productRepository';
import NavBar from '@/components/NavBar.vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const productos = ref([]);

// Cargar los productos al montar el componente
onMounted(async () => {
  try {
    const { productos: productosCargados } = await listarProductos();
    productos.value = productosCargados;
  } catch (error) {
    console.error('Error al cargar los productos:', error.message);
  }
});

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
        <img
          :src="`/images/${producto.imagen}`"
          :alt="producto.nombre"
          class="product-image"
        />
        <h2 class="product-name">{{ producto.nombre }}</h2>
      </div>
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
</style>
