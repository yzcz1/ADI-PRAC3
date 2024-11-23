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

// Datos de contacto
const contactInfo = ref({
  phone: '+34 123 456 789',
  email: 'soporte@trendyshop.com',
  address: 'Calle Moda 123, Madrid, España',
});

// Coordenadas de Google Maps
const mapUrl = ref(
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3048.555512315295!2d-3.7037907!3d40.4167754!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDFsDI0JzAwLjAiTiAzwrA0MScwMC4wIlc!5e0!3m2!1ses!2ses!4v1667317216938!5m2!1ses!2ses'
);
</script>

<template>
  <div class="contact-background">
    <!-- NavBar -->
    <NavBar :username="authStore.user?.email" @logout="logout" />

    <div class="contact-container">
      <h1>Contáctanos</h1>
      <p>Si tienes dudas o necesitas ayuda, ¡estamos aquí para ti!</p>

      <!-- Información de contacto -->
      <div class="contact-info">
        <p><strong>Teléfono:</strong> {{ contactInfo.phone }}</p>
        <p>
          <strong>Email:</strong>
          <a :href="`mailto:${contactInfo.email}`">{{ contactInfo.email }}</a>
        </p>
        <p><strong>Dirección:</strong> {{ contactInfo.address }}</p>
      </div>

      <!-- Google Maps -->
      <div class="map-container">
        <iframe
          :src="mapUrl"
          width="100%"
          height="400"
          style="border:0;"
          allowfullscreen=""
          loading="lazy"
        ></iframe>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Fondo general */
.contact-background {
  min-height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 6rem; /* Espacio para que el navbar no tape el contenido */
}

/* Contenedor principal */
.contact-container {
  max-width: 800px;
  width: 100%;
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  margin-top: 2rem;
}

/* Estilo de título */
h1 {
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 1rem;
}

/* Estilo de párrafos */
p {
  font-size: 1rem;
  color: #666;
  margin-bottom: 1rem;
}

/* Información de contacto */
.contact-info {
  margin: 2rem 0;
  text-align: left;
}

.contact-info p {
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.contact-info a {
  color: #007bff;
  text-decoration: none;
  font-weight: bold;
}

.contact-info a:hover {
  text-decoration: underline;
}

/* Contenedor de Google Maps */
.map-container {
  margin-top: 2rem;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>
