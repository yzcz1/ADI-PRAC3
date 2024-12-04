<template>
  <nav class="navbar">
    <div class="navbar-container">
      <!-- Logo o Nombre -->
      <div class="navbar-logo">TrendyShop</div>

      <!-- Elementos del NavBar -->
      <ul class="navbar-links">
        <!-- Link Welcome -->
        <li>
          <router-link to="/welcome" class="navbar-link">Welcome</router-link>
        </li>
        <!-- Link Contacto -->
        <li>
          <router-link to="/contact" class="navbar-link">Contacto</router-link>
        </li>
        <li>
          <router-link to="/about-us" class="navbar-link">Sobre Nosotros</router-link>
        </li>

        <li>
          <router-link to="/products" class="navbar-link">Nuestros Productos</router-link>
        </li>

        <!-- Mostrar "Crear Producto" solo si el usuario es administrador -->
        <li v-if="isAdmin">
          <router-link to="/create-product" class="navbar-link">Crear Producto</router-link>
        </li>

        <li>
          <router-link to="/user-data" class="navbar-link">Mis Datos</router-link>
        </li>
        <li class="cart-container">
          <router-link to="/cart" class="navbar-link">
            <i class="fas fa-shopping-cart"></i>
            <!-- Contador del carrito -->
            <span v-if="cartCount > 0" class="cart-counter">{{ cartCount }}</span>
          </router-link>
        </li>
        <!-- Nombre del usuario -->
        <li v-if="username" class="navbar-username">
          <span>Hola, {{ username }}</span>
        </li>
        <li>
          <a href="#" @click.prevent="$emit('logout')">Cerrar Sesión</a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
defineProps({
  username: {
    type: String,
    required: false,
    default: '',
  },
});

import { useAuthStore } from '@/stores/auth';
import { useCartStore } from '@/stores/cart';
import { computed } from 'vue';

// Usar el store de autenticación
const authStore = useAuthStore();
const cartStore = useCartStore();

// Computed para verificar si el usuario es administrador
const isAdmin = computed(() => authStore.user?.isAdmin || false);

// Computed para contar los productos en el carrito
const cartCount = computed(() => cartStore.cart.length);
</script>

<style scoped>
/* Estilos del NavBar */
.navbar {
  background-color: #333; /* Color de fondo */
  color: white;
  padding: 1rem 0;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%; /* Cubre todo el ancho de la pantalla */
  z-index: 1000;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2); /* Sombra */
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
}

.navbar-logo {
  font-size: 1.5rem;
  font-weight: bold;
}

.navbar-links {
  list-style: none;
  display: flex;
  gap: 1rem;
  margin: 0;
  padding: 0;
}

.navbar-links li {
  display: inline-block;
}

.navbar-links a,
.navbar-link {
  color: white;
  text-decoration: none;
  font-size: 1rem;
  transition: color 0.3s ease;
}

.navbar-links a:hover,
.navbar-link:hover {
  color: #ffd700; /* Color de hover */
}

.navbar-username span {
  font-size: 1rem;
  font-weight: bold;
  color: #ffd700;
}

.cart-container {
  position: relative;
}

.cart-counter {
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: #ffc107;
  color: #fff;
  font-size: 0.8rem;
  font-weight: bold;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
}
</style>
