<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

const isLoginMode = ref(true);
const email = ref('');
const password = ref('');
const nombre = ref('');
const apellidos = ref('');
const edad = ref('');

const toggleMode = () => {
  isLoginMode.value = !isLoginMode.value;
  clearFields();
};

const clearFields = () => {
  email.value = '';
  password.value = '';
  nombre.value = '';
  apellidos.value = '';
  edad.value = '';
};

const handleSubmit = async () => {
  try {
    if (isLoginMode.value) {
      await authStore.login(email.value, password.value);
      window.location.href = '/welcome';
    } else {
      await authStore.register(email.value, password.value, nombre.value, apellidos.value, edad.value);
      alert('Usuario registrado con éxito. Por favor, inicia sesión.');
      isLoginMode.value = true;
      clearFields();
    }
  } catch (error) {
    alert('Error: ' + error.message);
  }
};
</script>

<template>
  <div class="background">
    <div class="auth-container">
      <h1>{{ isLoginMode ? 'Iniciar Sesión' : 'Registro' }}</h1>
      <form @submit.prevent="handleSubmit" class="auth-form">
        <div>
          <label for="email">Email</label>
          <input id="email" v-model="email" type="email" required />
        </div>
        <div>
          <label for="password">Contraseña</label>
          <input id="password" v-model="password" type="password" required />
        </div>
        <div v-if="!isLoginMode">
          <label for="nombre">Nombre</label>
          <input id="nombre" v-model="nombre" type="text" required />
          <label for="apellidos">Apellidos</label>
          <input id="apellidos" v-model="apellidos" type="text" required />
          <label for="edad">Edad</label>
          <input id="edad" v-model="edad" type="number" required />
        </div>
        <button type="submit">{{ isLoginMode ? 'Iniciar Sesión' : 'Registrarse' }}</button>
      </form>
      <p>
        {{ isLoginMode ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?' }}
        <a @click="toggleMode" class="toggle-link">{{ isLoginMode ? 'Regístrate' : 'Inicia sesión' }}</a>
      </p>
    </div>
  </div>
</template>

<style scoped>
/* Elimina márgenes y asegura que el fondo cubra toda la pantalla */
html, body {
  margin: 0;
  padding: 0;
  width: 100%; /* Asegura que ocupa todo el ancho */
  height: 100%; /* Asegura que ocupa todo el alto */
  font-family: 'Arial', sans-serif;
  overflow: hidden; /* Elimina cualquier barra de desplazamiento innecesaria */
}

/* Fondo general */
.background {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw; /* Cubre todo el ancho visible */
  height: 100vh; /* Cubre todo el alto visible */
  background-color: #5cabef; /* Azul claro */
  position: fixed; /* Fija el fondo para evitar que se desplace */
  top: 0;
  left: 0;
}

/* Contenedor del formulario */
.auth-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* Sombra suave */
  text-align: center;
}

/* Formularios */
.auth-form div {
  margin-bottom: 1rem;
}

.auth-form input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  background-color: #4caf50;
  color: #fff;
  padding: 0.7rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #45a049;
}

/* Estilo del enlace interactivo (Regístrate/Inicia sesión) */
.toggle-link {
  color: #4caf50;
  font-weight: bold;
  cursor: pointer;
  text-decoration: none;
  transition: color 0.3s ease;
}

.toggle-link:hover {
  color: #45a049;
  text-decoration: underline;
}
</style>
