import { defineStore } from 'pinia';
import { ref } from 'vue';
import { loginUser, registerUser, logoutUser } from '@/services/authService';

export const useAuthStore = defineStore('auth', () => {
  // Estado reactivo para el usuario
  const user = ref(JSON.parse(localStorage.getItem('user')) || null);

  // Función para iniciar sesión
  const login = async (email, password) => {
    try {
      const loggedUser = await loginUser(email, password); // Llama al servicio de autenticación
      console.log("Usuario logueado:", loggedUser); // Verifica si incluye el campo `rol`
      const isAdmin = loggedUser?.rol === 'admin'; // Verifica si el rol es "admin"
  
      // Establece el usuario en el estado
      user.value = {
        email: loggedUser.email,
        uid: loggedUser.uid,
        nombre: loggedUser.displayName || 'Usuario', // Nombre del usuario
        rol: loggedUser.rol, // Rol del usuario
        isAdmin, // Bandera para saber si es administrador
      };
  
      localStorage.setItem('user', JSON.stringify(user.value)); // Guarda el usuario en el almacenamiento local
    } catch (error) {
      console.error('Error al iniciar sesión:', error.message);
      throw error; // Lanza el error para manejarlo en el componente
    }
  };
  

  // Función para registrar un nuevo usuario
  const register = async (email, password, nombre, apellidos, edad) => {
    try {
      const registeredUser = await registerUser(email, password, nombre, apellidos, edad);
      user.value = {
        email: registeredUser.email,
        uid: registeredUser.uid,
        nombre, // Almacena el nombre
        rol: 'usuario', // Por defecto, los usuarios registrados no son administradores
        isAdmin: false, // No es administrador
      };

      // Guarda el usuario en el almacenamiento local
      localStorage.setItem('user', JSON.stringify(user.value));
    } catch (error) {
      console.error('Error al registrar usuario:', error.message);
      throw error; // Lanza el error para manejarlo en el componente
    }
  };

  // Función para cerrar sesión
  const logout = async () => {
    try {
      await logoutUser(); // Llama al servicio para cerrar sesión
      user.value = null; // Limpia el estado del usuario
      localStorage.removeItem('user'); // Elimina el usuario del almacenamiento local
    } catch (error) {
      console.error('Error al cerrar sesión:', error.message);
      throw error; // Lanza el error para manejarlo en el componente
    }
  };

  // Comprueba si el usuario está autenticado
  const isAuthenticated = () => user.value !== null;

  // Devuelve los métodos y el estado para el store
  return {
    user,
    login,
    register,
    logout,
    isAuthenticated,
  };
});
