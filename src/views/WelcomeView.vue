<script setup>
import NavBar from '@/components/NavBar.vue';
import { useAuthStore } from '@/stores/auth';
import { ref } from 'vue';

const authStore = useAuthStore();

const logout = async () => {
  try {
    await authStore.logout();
    window.location.href = '/';
  } catch (error) {
    alert('Error al cerrar sesión: ' + error.message);
  }
};

// Lista de imágenes para el carrusel
const images = ref([
  new URL('@/assets/images/image1.jpg', import.meta.url).href,
  new URL('@/assets/images/image2.jpg', import.meta.url).href,
  new URL('@/assets/images/image3.jpg', import.meta.url).href,
]);

const currentSlide = ref(0);

// Función para ir al siguiente slide
const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % images.value.length;
};

// Función para ir al slide anterior
const prevSlide = () => {
  currentSlide.value =
    (currentSlide.value - 1 + images.value.length) % images.value.length;
};

// Función para ir a un slide específico
const goToSlide = (index) => {
  currentSlide.value = index;
};
</script>

<template>
  <div class="welcome-background">
    <!-- NavBar -->
    <NavBar @logout="logout" />

    <!-- Contenido principal -->
    <div class="welcome-container">
      <h1>Bienvenido a TrendyShop!</h1>

      <!-- Carrusel de imágenes -->
      <div class="carousel">
        <div class="carousel-images">
          <img
            v-for="(image, index) in images"
            :key="index"
            :src="image"
            :alt="'Imagen ' + (index + 1)"
            :class="{ active: currentSlide === index }"
          />
        </div>

        <!-- Controles del carrusel -->
        <div class="carousel-controls">
          <button @click="prevSlide">&lt;</button>
          <button @click="nextSlide">&gt;</button>
        </div>

        <!-- Indicadores -->
        <div class="carousel-indicators">
          <span
            v-for="(image, index) in images"
            :key="'indicator-' + index"
            :class="{ active: currentSlide === index }"
            @click="goToSlide(index)"
          ></span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Fondo principal de la vista */
.welcome-background {
  min-height: 100vh; /* Ocupa todo el alto de la pantalla */
  background-color: #ffffff; /* Fondo blanco */
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Contenedor principal de bienvenida */
.welcome-container {
  text-align: center;
  margin-top: 6rem; /* Espacio para no superponer al navbar */
  padding: 1rem;
}

h1 {
  font-size: 2.5rem;
  font-weight: bold;
  color: #333; /* Color del texto */
}

/* Estilo del carrusel */
.carousel {
  position: relative;
  max-width: 800px;
  margin: 2rem auto;
  overflow: hidden;
  border-radius: 8px; /* Bordes redondeados */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* Imágenes del carrusel */
.carousel-images img {
  width: 100%;
  display: none;
  transition: opacity 0.5s ease-in-out;
}

.carousel-images img.active {
  display: block;
}

/* Controles del carrusel */
.carousel-controls {
  position: absolute;
  top: 50%;
  width: 100%;
  display: flex;
  justify-content: space-between;
  transform: translateY(-50%);
}

.carousel-controls button {
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 50%;
  font-size: 1.5rem;
}

.carousel-controls button:hover {
  background-color: rgba(0, 0, 0, 0.8);
}

/* Indicadores del carrusel */
.carousel-indicators {
  position: absolute;
  bottom: 10px;
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.carousel-indicators span {
  display: inline-block;
  width: 10px;
  height: 10px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  cursor: pointer;
}

.carousel-indicators span.active {
  background-color: white;
}
</style>
