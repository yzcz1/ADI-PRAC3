import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCartStore = defineStore('cart', () => {
  const cart = ref([]);

  // Añadir un producto al carrito
  const addToCart = (product) => {
    // Verifica si el producto ya existe en el carrito
    const exists = cart.value.some((item) => item.id === product.id);
    if (!exists) {
      cart.value.push(product);
      return true; // Retorna true si se añadió exitosamente
    }
    return false; // Retorna false si el producto ya existe
  };

  // Eliminar un producto del carrito
  const removeFromCart = (productId) => {
    const index = cart.value.findIndex((item) => item.id === productId);
    if (index !== -1) {
      cart.value.splice(index, 1);
    }
  };

  // Vaciar el carrito
  const clearCart = () => {
    cart.value = [];
  };

  return {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
  };
});
