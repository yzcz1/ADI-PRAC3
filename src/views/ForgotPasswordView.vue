<script setup>
import { ref } from 'vue';
import { forgotPassword } from '@/services/authService'; // Importa la función para enviar el correo

// Variables reactivas
const email = ref('');
const message = ref('');
const messageType = ref(''); // Puede ser 'success' o 'danger'
const isSubmitting = ref(false); // Para evitar múltiples envíos

// Función para manejar el envío del formulario
const handleSubmit = async () => {
  if (!email.value) {
    showMessage('Por favor, introduce un correo electrónico.', 'danger');
    return;
  }

  try {
    isSubmitting.value = true; // Evita múltiples envíos
    await forgotPassword(email.value);
    showMessage(
      'Se ha enviado correctamente el correo para resetear la contraseña.',
      'success'
    );
    setTimeout(() => {
      window.location.href = '/'; // Redirige a la vista principal después de 5 segundos
    }, 5000);
  } catch (error) {
    showMessage('Hubo un error al enviar el correo. Inténtalo nuevamente.', 'danger');
    console.error('Error al enviar correo de restablecimiento:', error.message);
  } finally {
    isSubmitting.value = false;
  }
};

// Función para mostrar mensajes
const showMessage = (msg, type) => {
  message.value = msg;
  messageType.value = type;

  // Elimina el mensaje después de 5 segundos
  setTimeout(() => {
    message.value = '';
    messageType.value = '';
  }, 5000);
};
</script>

<template>
  <div class="background">
    <div class="forgot-password-container">
      <h1>¿Olvidaste tu contraseña?</h1>
      <p>Introduce tu correo electrónico y te enviaremos un enlace para restablecerla.</p>
      <form @submit.prevent="handleSubmit" class="forgot-password-form">
        <div>
          <label for="email">Correo Electrónico</label>
          <input
            id="email"
            type="email"
            v-model="email"
            placeholder="Introduce tu correo"
            required
          />
        </div>
        <!-- Mensaje dinámico -->
        <div
          v-if="message"
          :class="['form-message', `form-message-${messageType}`]"
        >
          {{ message }}
        </div>
        <button type="submit" :disabled="isSubmitting">
          {{ isSubmitting ? 'Enviando...' : 'Enviar correo' }}
        </button>
      </form>
      <p class="back-to-login">
        <router-link to="/">Volver al inicio de sesión</router-link>
      </p>
    </div>
  </div>
</template>

<style scoped>
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
.forgot-password-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
}

h1 {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 1rem;
}

p {
  color: #666;
  margin-bottom: 1rem;
}

/* Formulario */
.forgot-password-form div {
  margin-bottom: 1rem;
}

.forgot-password-form input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  width: 100%;
  background-color: #4caf50;
  color: white;
  padding: 0.7rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #45a049;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* Mensajes */
.form-message {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  padding: 0.5rem;
  border-radius: 4px;
  text-align: left;
}

.form-message-success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.form-message-danger {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.back-to-login {
  margin-top: 1rem;
}

.back-to-login a {
  color: #4caf50;
  text-decoration: none;
  font-weight: bold;
}

.back-to-login a:hover {
  text-decoration: underline;
}
</style>
