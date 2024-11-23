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

// Ruta correcta al logo
const logoSrc = new URL('@/assets/images/image1.jpg', import.meta.url).href;
</script>

<template>
  <div class="aboutus-background">
    <!-- NavBar -->
    <NavBar :username="authStore.user?.email" @logout="logout" />

    <div class="aboutus-container">
      <!-- Sección del logo -->
      <div class="logo-section">
        <img :src="logoSrc" alt="Logo de TrendyShop" class="aboutus-logo" />
        <h1>Sobre Nosotros</h1>
        <p>Descubre más acerca de nuestra misión, visión y valores en TrendyShop.</p>
      </div>

      <!-- Sección de historia -->
      <div class="section">
        <h2>Nuestra Historia</h2>
        <p>
          Fundada en 2023, TrendyShop comenzó como una pequeña tienda online con
          la misión de ofrecer ropa de alta calidad a precios accesibles. Con el
          apoyo de nuestros clientes, hemos crecido hasta convertirnos en una
          de las tiendas online más queridas en España.
        </p>
      </div>

      <!-- Sección de misión -->
      <div class="section">
        <h2>Nuestra Misión</h2>
        <p>
          En TrendyShop, nos dedicamos a ofrecer productos que combinan estilo,
          comodidad y sostenibilidad. Queremos que cada cliente se sienta
          especial y que cada compra sea una experiencia única.
        </p>
      </div>

      <!-- Sección de visión -->
      <div class="section">
        <h2>Nuestra Visión</h2>
        <p>
          Ser líderes en el mercado de la moda online, innovando y ofreciendo
          las mejores tendencias mientras cuidamos del medio ambiente.
        </p>
      </div>

      <!-- Sección de valores -->
      <div class="section">
        <h2>Nuestros Valores</h2>
        <ul>
          <li>Compromiso con la calidad</li>
          <li>Atención al cliente excepcional</li>
          <li>Sostenibilidad y respeto por el medio ambiente</li>
          <li>Innovación constante</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.aboutus-background {
  min-height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 6rem; /* Espacio para que no tape el navbar */
}

.aboutus-container {
  max-width: 900px;
  width: 100%;
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  margin-top: 2rem;
}

/* Logo */
.logo-section {
  margin-bottom: 2rem;
}

.aboutus-logo {
  width: 150px;
  height: auto;
  margin-bottom: 1rem;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Títulos */
h1 {
  font-size: 2.5rem;
  font-weight: bold;
  color: #333;
}

h2 {
  font-size: 1.8rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 1rem;
}

/* Texto */
p {
  font-size: 1rem;
  color: #666;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

/* Listas */
ul {
  list-style-type: disc;
  text-align: left;
  padding-left: 2rem;
}

ul li {
  font-size: 1rem;
  color: #666;
  margin-bottom: 0.5rem;
}

/* Sección */
.section {
  margin-bottom: 2rem;
}
</style>
