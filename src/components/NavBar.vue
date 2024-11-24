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

        <li><a href="#">Nuestros Productos</a></li>

        <!-- Mostrar "Crear Producto" solo si el usuario es administrador -->
        <li v-if="isAdmin">
          <router-link to="/create-product" class="navbar-link">Crear Producto</router-link>
        </li>

        <li>
          <router-link to="/user-data" class="navbar-link">Mis Datos</router-link>
        </li>
        <li><a href="#"><i class="fas fa-shopping-cart"></i></a></li>
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

import { useAuthStore } from "@/stores/auth";
import { computed } from "vue";

// Usar el store de autenticación
const authStore = useAuthStore();

// Computed para verificar si el usuario es administrador
const isAdmin = computed(() => authStore.user?.isAdmin || false);
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
</style>
