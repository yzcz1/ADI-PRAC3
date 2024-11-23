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

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % images.value.length;
};

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + images.value.length) % images.value.length;
};

const goToSlide = (index) => {
  currentSlide.value = index;
};

// Lista de imágenes de productos
const productImages = ref([
  new URL('@/assets/images/product1.jpg', import.meta.url).href,
  new URL('@/assets/images/product2.jpg', import.meta.url).href,
  new URL('@/assets/images/product3.jpg', import.meta.url).href,
]);

// Lista de imágenes para "Descubre más"
const discoverImages = ref([
  new URL('@/assets/images/product4.jpg', import.meta.url).href,
  new URL('@/assets/images/product5.jpg', import.meta.url).href,
  new URL('@/assets/images/product6.jpg', import.meta.url).href,
]);
</script>

<template>
  <div class="welcome-background">
    <!-- Usa NavBar con el email del usuario -->
    <NavBar :username="authStore.user?.email" @logout="logout" />

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

        <div class="carousel-controls">
          <button @click="prevSlide">&lt;</button>
          <button @click="nextSlide">&gt;</button>
        </div>

        <div class="carousel-indicators">
          <span
            v-for="(image, index) in images"
            :key="'indicator-' + index"
            :class="{ active: currentSlide === index }"
            @click="goToSlide(index)"
          ></span>
        </div>
      </div>

      <!-- Nuevo título -->
      <h2 class="section-title">Lo mejor y más nuevo</h2>

      <!-- Imágenes de productos -->
      <div class="product-row">
        <img
          v-for="(product, index) in productImages"
          :key="'product-' + index"
          :src="product"
          :alt="'Producto ' + (index + 1)"
          class="product-image"
        />
      </div>

      <!-- Descubre más título -->
      <h2 class="section-title">Descubre más</h2>

      <!-- Imágenes de Descubre más -->
      <div class="product-row">
        <img
          v-for="(discover, index) in discoverImages"
          :key="'discover-' + index"
          :src="discover"
          :alt="'Descubre ' + (index + 1)"
          class="product-image"
        />
      </div>
    </div>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-logo">TrendyShop</div>
        <div class="footer-links">
          <a href="#">Política de Privacidad</a>
          <a href="#">Términos y Condiciones</a>
          <a href="#">Contáctanos</a>
        </div>
        <div class="footer-copy">
          © 2024 TrendyShop. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.welcome-background {
  min-height: 100vh;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.welcome-container {
  text-align: center;
  margin-top: 6rem;
  padding: 1rem;
}

h1 {
  font-size: 2.5rem;
  font-weight: bold;
  color: #333;
}

/* Carrusel */
.carousel {
  position: relative;
  max-width: 800px;
  margin: 2rem auto;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.carousel-images img {
  width: 100%;
  display: none;
  transition: opacity 0.5s ease-in-out;
}

.carousel-images img.active {
  display: block;
}

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

/* Título de la sección */
.section-title {
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  margin-top: 2rem;
  margin-bottom: 1.5rem;
}

/* Fila de productos */
.product-row {
  display: flex;
  justify-content: center;
  gap: 1.5rem; /* Espaciado entre imágenes */
}

.product-image {
  width: 250px; /* Ajusta el tamaño de las imágenes */
  height: 200px; /* Ajusta la altura para mantener uniformidad */
  object-fit: cover; /* Ajusta la imagen sin distorsionarla */
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.product-image:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}

/* Footer */
.footer {
  background-color: #333;
  color: white;
  padding: 2rem 1rem;
  text-align: center;
  margin-top: 2rem;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
}

.footer-logo {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.footer-links {
  margin-bottom: 1rem;
}

.footer-links a {
  color: white;
  text-decoration: none;
  margin: 0 1rem;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.footer-links a:hover {
  color: #ffd700; /* Color dorado en hover */
}

.footer-copy {
  font-size: 0.8rem;
}
</style>
