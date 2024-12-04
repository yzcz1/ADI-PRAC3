import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCartStore = defineStore('cart', () => {
  const cart = ref([]);

  // Añadir un producto al carrito
  const addToCart = (product) => {
    cart.value.push(product);
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
