<script setup>
import NavBar from '@/components/NavBar.vue';
import { useCartStore } from '@/stores/cart';
import { useAuthStore } from '@/stores/auth';
import { computed } from 'vue';

const cartStore = useCartStore();
const authStore = useAuthStore();

const logout = async () => {
  try {
    await authStore.logout();
    window.location.href = '/';
  } catch (error) {
    alert('Error al cerrar sesión: ' + error.message);
  }
};

// Computed para calcular el subtotal
const subtotal = computed(() => cartStore.calculateSubtotal());

// Total (igual al subtotal porque los envíos son gratuitos)
const total = computed(() => subtotal.value);

// Función para manejar el pago con Stripe
const handleCheckout = async () => {
  try {
    // Verificar y mostrar el contenido de cartStore.cart
    console.log('Contenido de cartStore.cart:', cartStore.cart);

    // Validar si el carrito no está vacío antes de continuar
    if (cartStore.cart.length === 0) {
      alert('El carrito está vacío. Agrega productos antes de finalizar la compra.');
      return;
    }

    const items = cartStore.cart.map((product) => ({
      nombre: product.nombre,
      descripcion: product.descripcion,
      precio: product.precio * 100, // Convertir a centavos
      quantity: product.quantity,
    }));

    console.log('Items enviados al backend:', items);

    const response = await fetch('http://localhost:4000/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    });

    // Verificar si la respuesta del backend es válida
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error del backend:', errorData);
      alert(errorData.error || 'Error al procesar el pago.');
      return;
    }

    const data = await response.json();
    console.log('URL recibida de Stripe:', data.url);

    // Redirigir a Stripe Checkout
    window.location.href = data.url;
  } catch (error) {
    console.error('Error durante el checkout:', error);
    alert('Ocurrió un error al procesar el pago.');
  }
};

</script>

<template>
 <NavBar :username="authStore.user?.email" @logout="logout" />
  <div class="cart-container">
    <h1>Carrito de Compras</h1>
    <div v-if="cartStore.cart.length === 0">
      <p>Tu carrito está vacío.</p>
    </div>
    <div v-else class="cart-content">
      <!-- Listado de productos -->
      <div class="cart-items">
        <div v-for="product in cartStore.cart" :key="product.id" class="cart-item">
          <img :src="`/images/${product.imagen}`" alt="Producto" class="cart-image" />
          <div class="cart-details">
            <h2>{{ product.nombre }}</h2>
            <p>€{{ product.precio.toFixed(2) }}</p>

            <!-- Selector de cantidad -->
            <div class="quantity-selector">
              <button @click="cartStore.decrementQuantity(product.id)">-</button>
              <span>{{ product.quantity }}</span>
              <button @click="cartStore.incrementQuantity(product.id)">+</button>
            </div>
          </div>

          <!-- Botón para eliminar -->
          <button class="remove-button" @click="cartStore.removeFromCart(product.id)">
            Eliminar
          </button>
        </div>
      </div>

      <!-- Resumen del carrito -->
      <div class="cart-summary">
        <h2>Resumen</h2>
        <p>Subtotal: €{{ subtotal.toFixed(2) }}</p>
        <p>Gastos de envío y gestión estimados: Gratuito</p>
        <p><strong>Total: €{{ total.toFixed(2) }}</strong></p>
        <button class="checkout-button" @click="handleCheckout">Finalizar compra</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cart-container {
  max-width: 1200px;
  margin: 2rem auto;
  background: white;
  padding: 1rem;
  border-radius: 8px;
}

.cart-content {
  display: flex;
  justify-content: space-between; /* Espaciado entre listado y resumen */
  align-items: flex-start; /* Alineación superior */
  gap: 2rem;
}

.cart-items {
  flex: 2; /* Toma más espacio para el listado */
}

.cart-item {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #ddd;
  padding: 1rem 0;
}

.cart-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  margin-right: 1rem;
}

.cart-details {
  flex-grow: 1;
}

.quantity-selector {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.quantity-selector button {
  background: #007bff;
  color: white;
  border: none;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  cursor: pointer;
}

.quantity-selector button:hover {
  background: #0056b3;
}

.remove-button {
  background: #dc3545;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.remove-button:hover {
  background: #bd2130;
}

.cart-summary {
  flex: 1; /* Toma menos espacio para el resumen */
  background: #f8f9fa;
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 8px;
  text-align: left; /* Alineación de texto */
}

.cart-summary h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.cart-summary p {
  margin: 0.5rem 0;
}

.checkout-button {
  background: #28a745;
  color: white;
  border: none;
  padding: 0.7rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
}

.checkout-button:hover {
  background: #218838;
}
</style>
