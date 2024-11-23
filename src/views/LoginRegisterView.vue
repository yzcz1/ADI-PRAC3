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
      // Lógica de inicio de sesión
      await authStore.login(email.value, password.value);
      // Redirigir al usuario a la vista de bienvenida
      window.location.href = '/welcome';
    } else {
      // Lógica de registro
      await authStore.register(email.value, password.value, nombre.value, apellidos.value, edad.value);
      alert('Usuario registrado con éxito. Por favor, inicia sesión.');
      // Cambiar a modo de inicio de sesión después de registrarse
      isLoginMode.value = true;
      clearFields();
    }
  } catch (error) {
    alert('Error: ' + error.message);
  }
};
</script>

<template>
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
      <a @click="toggleMode">{{ isLoginMode ? 'Regístrate' : 'Inicia sesión' }}</a>
    </p>
  </div>
</template>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
  text-align: center;
}

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
}

button:hover {
  background-color: #45a049;
}
</style>
