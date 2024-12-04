<script setup>
import NavBar from '@/components/NavBar.vue';
import { useCartStore } from '@/stores/cart';

const cartStore = useCartStore();
</script>

<template>
  <NavBar />
  <div class="cart-container">
    <h1>Carrito de Compras</h1>
    <div v-if="cartStore.cart.length === 0">
      <p>Tu carrito está vacío.</p>
    </div>
    <div v-else>
      <div v-for="product in cartStore.cart" :key="product.id" class="cart-item">
        <img :src="`/images/${product.imagen}`" alt="Producto" class="cart-image" />
        <div class="cart-details">
          <h2>{{ product.nombre }}</h2>
          <p>€{{ product.precio.toFixed(2) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cart-container {
  max-width: 800px;
  margin: 2rem auto;
  background: white;
  padding: 1rem;
  border-radius: 8px;
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
</style>
