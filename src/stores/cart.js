import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCartStore = defineStore('cart', () => {
  const cart = ref([]);

  // Añadir un producto al carrito
  const addToCart = (product) => {
    const existingProduct = cart.value.find((item) => item.id === product.id);
    if (existingProduct) {
      existingProduct.quantity += 1; // Incrementa la cantidad si ya existe
      return false;
    } else {
      cart.value.push({ ...product, quantity: 1 }); // Agrega el producto con cantidad 1
      return true;
    }
  };

  // Incrementar la cantidad de un producto
  const incrementQuantity = (productId) => {
    const product = cart.value.find((item) => item.id === productId);
    if (product) {
      product.quantity += 1;
    }
  };

  // Decrementar la cantidad de un producto
  const decrementQuantity = (productId) => {
    const product = cart.value.find((item) => item.id === productId);
    if (product) {
      product.quantity -= 1;
      if (product.quantity === 0) {
        removeFromCart(productId); // Elimina el producto si la cantidad llega a 0
      }
    }
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

  // Calcular el subtotal del carrito
  const calculateSubtotal = () => {
    return cart.value.reduce((total, item) => total + item.precio * item.quantity, 0);
  };

  return {
    cart,
    addToCart,
    incrementQuantity,
    decrementQuantity,
    removeFromCart,
    clearCart,
    calculateSubtotal,
  };
});
