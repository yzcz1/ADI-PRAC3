import { defineStore } from 'pinia';
import { ref } from 'vue';
import { loginUser, registerUser, logoutUser } from '@/services/authService';

export const useAuthStore = defineStore('auth', () => {
  // Inicializar el usuario desde localStorage si existe
  const user = ref(JSON.parse(localStorage.getItem('user')) || null);

  const login = async (email, password) => {
    try {
      const loggedUser = await loginUser(email, password);
      user.value = { email: loggedUser.email, uid: loggedUser.uid };

      // Guardar el usuario autenticado en localStorage
      localStorage.setItem('user', JSON.stringify(user.value));
    } catch (error) {
      console.error('Error al iniciar sesión:', error.message);
      throw error;
    }
  };

  const register = async (email, password, nombre, apellidos, edad) => {
    try {
      const registeredUser = await registerUser(email, password, nombre, apellidos, edad);
      user.value = { email: registeredUser.email, uid: registeredUser.uid };

      // Guardar el usuario autenticado en localStorage
      localStorage.setItem('user', JSON.stringify(user.value));
    } catch (error) {
      console.error('Error al registrar usuario:', error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      user.value = null;

      // Eliminar el usuario del localStorage al cerrar sesión
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Error al cerrar sesión:', error.message);
      throw error;
    }
  };

  const isAuthenticated = () => user.value !== null;

  return { user, login, register, logout, isAuthenticated };
});
