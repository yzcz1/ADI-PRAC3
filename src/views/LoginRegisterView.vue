<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter, useRoute } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const isLoginMode = ref(true);
const email = ref('');
const password = ref('');
const nombre = ref('');
const apellidos = ref('');
const edad = ref('');

// Mensajes reactivos
const message = ref('');
const messageType = ref(''); // Puede ser 'success' o 'danger'

// Clases reactivas para el efecto de temblor
const shakeClass = ref(false);
const shakeButtonClass = ref(false);

// Manejo del mensaje de éxito desde "Forgot Password"
if (route.query.success === 'true') {
  message.value = 'Se ha enviado correctamente el correo para resetear la contraseña.';
  messageType.value = 'success';
  setTimeout(() => clearMessage(), 5000);
}

const toggleMode = () => {
  isLoginMode.value = !isLoginMode.value;
  clearFields();
  clearMessage(); // Limpia mensajes al cambiar entre modos
};

const clearFields = () => {
  email.value = '';
  password.value = '';
  nombre.value = '';
  apellidos.value = '';
  edad.value = '';
};

const clearMessage = () => {
  message.value = '';
  messageType.value = '';
};

const handleSubmit = async () => {
  try {
    if (password.value.length < 6 && isLoginMode.value) {
      triggerShake(); // Efecto de temblor
      showMessage('La contraseña es demasiado corta. Debe tener al menos 6 caracteres.', 'danger');
      clearFields();
      return; // Salir antes de intentar registrar o iniciar sesión
    }

    if (isLoginMode.value) {
      await authStore.login(email.value, password.value);
      showMessage('Inicio de sesión exitoso.', 'success');
      setTimeout(() => (window.location.href = '/welcome'), 1500);
    } else {
      await authStore.register(email.value, password.value, nombre.value, apellidos.value, edad.value);
      showMessage('Te has registrado exitosamente.', 'success');
      isLoginMode.value = true;
      clearFields();
    }
  } catch (error) {
    triggerShake();
    showMessage(getFirebaseErrorMessage(error.code), 'danger');
    clearFields();
  }
};

// Función para manejar errores de Firebase
const getFirebaseErrorMessage = (errorCode) => {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'El correo electrónico ya está en uso.';
    case 'auth/invalid-email':
      return 'Correo electrónico no válido.';
    case 'auth/user-not-found':
      return 'Usuario no encontrado.';
    case 'auth/wrong-password':
      return 'Contraseña incorrecta.';
    default:
      return 'Credenciales incorrectas.';
  }
};

// Función para disparar el efecto de temblor
const triggerShake = () => {
  shakeClass.value = true;
  shakeButtonClass.value = true;
  setTimeout(() => {
    shakeClass.value = false;
    shakeButtonClass.value = false;
  }, 500); // Duración del efecto de temblor
};

// Función para mostrar mensajes con auto-limpieza
const showMessage = (msg, type) => {
  message.value = msg;
  messageType.value = type;

  // Elimina el mensaje después de 5 segundos
  setTimeout(clearMessage, 5000);
};
</script>

<template>
  <div class="background">
    <div :class="['auth-container', { shake: shakeClass }]">
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
        <!-- Mensaje dinámico, depende del modo -->
        <div
          v-if="message"
          :class="['form-message', `form-message-${messageType}`]"
          :style="{ marginTop: isLoginMode || messageType === 'danger' ? '0.5rem' : '1rem' }"
        >
          {{ message }}
        </div>
        <button :class="{ shake: shakeButtonClass }" type="submit">
          {{ isLoginMode ? 'Iniciar Sesión' : 'Registrarse' }}
        </button>
      </form>
      <p>
        {{ isLoginMode ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?' }}
        <a @click="toggleMode" class="toggle-link">{{ isLoginMode ? 'Regístrate' : 'Inicia sesión' }}</a>
      </p>
      <p v-if="isLoginMode">
        <router-link to="/forgot-password" class="forgot-link">¿Olvidaste tu contraseña?</router-link>
      </p>
    </div>
  </div>
</template>

<style scoped>
/* Elimina márgenes y asegura que el fondo cubra toda la pantalla */
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  font-family: 'Arial', sans-serif;
  overflow: hidden;
}

/* Fondo general */
.background {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-color: #91c7f6;
  position: fixed;
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
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.2s ease;
}

/* Efecto de temblor */
.auth-container.shake,
button.shake {
  animation: shake 0.5s ease;
}

@keyframes shake {
  0% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  50% {
    transform: translateX(5px);
  }
  75% {
    transform: translateX(-5px);
  }
  100% {
    transform: translateX(0);
  }
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

.forgot-link {
  display: block;
  margin-top: 1rem;
  color: #007bff;
  text-decoration: none;
}

.forgot-link:hover {
  text-decoration: underline;
}

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

/* Mensajes dentro del formulario */
.form-message {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  padding: 0.5rem;
  border-radius: 4px;
}

.form-message-success {
  background-color: #d4edda;
  color: #155724;
}

.form-message-danger {
  background-color: #f8d7da;
  color: #721c24;
}
</style>
