<script setup>
import { ref } from 'vue';
import NavBar from '@/components/NavBar.vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { createProducto } from '@/repositories/productRepository';


const authStore = useAuthStore();
const router = useRouter();

const logout = async () => {
  try {
    await authStore.logout();
    window.location.href = '/';
  } catch (error) {
    alert('Error al cerrar sesión: ' + error.message);
  }
};

// Campos del formulario
const nombre = ref('');
const categoria = ref('');
const precio = ref('');
const descripcion = ref('');
const imagen = ref(''); // Campo para almacenar la imagen seleccionada


// Mensajes y estados
const errorMessage = ref('');
const successMessage = ref('');
const isLoading = ref(false);

// Validación del formulario
const validateForm = () => {
  if (!nombre.value.trim()) {
    errorMessage.value = 'El nombre del producto es obligatorio.';
    return false;
  }
  if (!categoria.value.trim()) {
    errorMessage.value = 'La categoría es obligatoria.';
    return false;
  }
  if (!precio.value || isNaN(precio.value) || precio.value <= 0) {
    errorMessage.value = 'El precio debe ser un número mayor a 0.';
    return false;
  }
  if (!descripcion.value.trim()) {
    errorMessage.value = 'La descripción es obligatoria.';
    return false;
  }
  if (!imagen.value.trim()) {
    errorMessage.value = 'Debes seleccionar una imagen para el producto.';
    return false;
  }
  return true;
};


// Manejo del envío del formulario
const handleCreateProduct = async () => {
  if (!validateForm()) return;

  isLoading.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    // Incluye el campo imagen al llamar a createProducto
    await createProducto(
      nombre.value,
      categoria.value,
      parseFloat(precio.value),
      descripcion.value,
      imagen.value // Incluye la imagen seleccionada
    );

    successMessage.value = 'Producto creado exitosamente.';

    // Limpia todos los campos después de crear el producto
    nombre.value = '';
    categoria.value = '';
    precio.value = '';
    descripcion.value = '';
    imagen.value = ''; // Limpia la selección de imagen

    // Redirige al usuario a otra vista si es necesario
    setTimeout(() => router.push('/welcome'), 2000);
  } catch (error) {
    errorMessage.value = 'Error al crear el producto. Por favor, inténtalo de nuevo.';
    console.error('Error al crear el producto:', error.message);
  } finally {
    isLoading.value = false;
  }
};

</script>

<template>
    <NavBar :username="authStore.user?.email" @logout="logout" />
  <div class="create-product-container">
    <h1>Crear Producto</h1>
    <form @submit.prevent="handleCreateProduct" class="form">
      <!-- Campo Nombre -->
      <div class="form-group">
        <label for="nombre">Nombre</label>
        <input id="nombre" v-model="nombre" type="text" placeholder="Nombre del producto" required />
      </div>

      <!-- Campo Categoría -->
      <div class="form-group">
        <label for="categoria">Categoría</label>
        <input id="categoria" v-model="categoria" type="text" placeholder="Categoría" required />
      </div>

      <!-- Campo Precio -->
      <div class="form-group">
        <label for="precio">Precio (€)</label>
        <input id="precio" v-model="precio" type="number" placeholder="Precio" required min="0.01" step="0.01" />
      </div>

      <!-- Campo Descripción -->
      <div class="form-group">
        <label for="descripcion">Descripción</label>
        <textarea id="descripcion" v-model="descripcion" placeholder="Descripción del producto" required></textarea>
      </div>

      <!-- Campo para seleccionar imagen -->
        <div class="form-group">
         <label for="imagen">Imagen</label>
         <select id="imagen" v-model="imagen" required class="select-button">
            <option value="">Selecciona una imagen</option>
            <option value="bolsa_de_mano_skepta.jpg">bolsa_de_mano_skepta.jpg</option>
            <option value="bolso_puma_coperni.jpg">bolso_puma_coperni.jpg</option>
            <option value="botas_futbol_ultra_5.jpg">botas_futbol_ultra_5.jpg</option>
            <option value="botas_puma_evolve_niño.jpg">botas_puma_evolve_niño.jpg</option>
            <option value="camiseta_ac_milan.jpg">camiseta_ac_milan.jpg</option>

            <option value="camiseta_manchester_city.jpg">camiseta_manchester_city.jpg</option>
            <option value="camiseta_puma_rocket_league.jpg">camiseta_puma_rocket_league.jpg</option>
            <option value="camiseta_pumaSquad_negra.jpg">camiseta_pumaSquad_negra.jpg</option>
            <option value="camiseta_skepta_blanca.jpg">camiseta_skepta_blanca.jpg</option>
            <option value="chaqueta_minicats_niños.jpg">chaqueta_minicats_niños.jpg</option>

            <option value="chaqueta_reversible_negra.jpg">chaqueta_reversible_negra.jpg</option>
            <option value="chaqueta_skepta_negra.jpg">chaqueta_skepta_negra.jpg</option>
            <option value="chaqueta_verde_puma.jpg">chaqueta_verde_puma.jpg</option>
            <option value="gorro_comic_rosa.jpg">gorro_comic_rosa.jpg</option>
            <option value="gorro_de_baloncesto.jpg">gorro_de_baloncesto.jpg</option>

            <option value="jersey_puma_coperni.jpg">jersey_puma_coperni.jpg</option>
            <option value="pantalon_chandal_negro.jpg">pantalon_chandal_negro.jpg</option>
            <option value="sombrero_boonie_negro.jpg">sombrero_boonie_negro.jpg</option>
            <option value="sudadera_puma_gris.jpg">sudadera_puma_gris.jpg</option>
            <option value="sudadera_pumaSquad_rosa.jpg">sudadera_pumaSquad_rosa.jpg</option>

            <option value="sujetador_puma_blanco.jpg">sujetador_puma_blanco.jpg</option>
            <option value="vestido_largo_coperni.jpg">vestido_largo_coperni.jpg</option>
            <option value="zapatillas_arizona_azules.jpg">zapatillas_arizona_azules.jpg</option>
            <option value="zapatillas_arizona_verdes.jpg">zapatillas_arizona_verdes.jpg</option>
            <option value="zapatillas_beige_nike.jpg">zapatillas_beige_nike.jpg</option>

            <option value="zapatillas_inhale_unisex.jpg">zapatillas_inhale_unisex.jpg</option>
            <option value="zapatillas_negras_nike.jpg">zapatillas_negras_nike.jpg</option>
            <option value="zapatillas_nike_air_max_plus.jpg">zapatillas_nike_air_max_plus.jpg</option>
            <option value="zapatillas_nike_retro_azul_claro.jpg">zapatillas_nike_retro_azul_claro.jpg</option>
            <option value="zapatillas_puma_coperni.jpg">zapatillas_puma_coperni.jpg</option>
            
            <!-- Añade aquí el resto de tus imágenes -->
        </select>
        </div>


      <!-- Mensajes -->
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      <div v-if="successMessage" class="success-message">{{ successMessage }}</div>

      <!-- Botón Crear -->
      <button type="submit" :disabled="isLoading" class="create-button">
        {{ isLoading ? 'Creando...' : 'Crear Producto' }}
      </button>
    </form>
  </div>
</template>

<style scoped>
.create-product-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

h1 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 1.5rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  text-align: left;
}

label {
  font-size: 1rem;
  color: #333;
  margin-bottom: 0.5rem;
}

input,
textarea {
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.3s ease;
}

input:focus,
textarea:focus {
  border-color: #007bff;
  outline: none;
}

textarea {
  resize: vertical;
  min-height: 100px;
}

button {
  padding: 0.75rem;
  font-size: 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #0056b3;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.error-message {
  color: #d9534f;
  font-size: 0.9rem;
}

.success-message {
  color: #5cb85c;
  font-size: 0.9rem;
}

/* Estilo para el select como botón */
.select-button {
  appearance: none; /* Elimina el estilo predeterminado */
  -webkit-appearance: none;
  -moz-appearance: none;
  background-color: #67acf6; /* Color del botón */
  color: white;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
  width: 100%;
}

/* Hover y enfoque para el select */
.select-button:hover {
  background-color: #6eace9;
}

.select-button:focus {
  outline: none;
  box-shadow: 0 0 5px rgba(129, 183, 241, 0.5);
}

/* Cambiar color de la opción seleccionada */
.select-button option {
  color: #333;
}
</style>
