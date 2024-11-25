import { defineStore } from 'pinia';
import { ref } from 'vue';
import {
  listarProductos,
  eliminarProducto,
  modificarProducto,
  createProducto,
  obtenerProducto,
} from '@/repositories/productRepository';

export const useProductStore = defineStore('product', () => {
  // Estado reactivo para almacenar los productos y su estado
  const productos = ref([]);
  const currentPage = ref(1);
  const hasMorePages = ref(true);
  const isLoading = ref(false);
  const pageSnapshots = ref([]);

  // Métodos del store

  // Listar productos con paginación
  const loadProductos = async (pagina = 1, itemsPerPage = 6) => {
    isLoading.value = true;
    try {
      let lastVisible = null;
      if (pagina > 1 && pageSnapshots.value[pagina - 2]) {
        lastVisible = pageSnapshots.value[pagina - 2];
      }

      const { productos: nuevosProductos, lastVisible: nuevoLastVisible } =
        await listarProductos(itemsPerPage, lastVisible);

      productos.value = nuevosProductos;

      if (pagina > pageSnapshots.value.length) {
        pageSnapshots.value.push(nuevoLastVisible);
      }

      hasMorePages.value = nuevosProductos.length === itemsPerPage;
      currentPage.value = pagina;
    } catch (error) {
      console.error('Error al cargar productos:', error.message);
    } finally {
      isLoading.value = false;
    }
  };

  // Eliminar un producto
  const deleteProducto = async (id) => {
    try {
      await eliminarProducto(id);
      // Actualiza el listado local eliminando el producto borrado
      productos.value = productos.value.filter((producto) => producto.id !== id);
    } catch (error) {
      console.error('Error al eliminar producto:', error.message);
    }
  };

  // Crear un nuevo producto
  const createProductoInStore = async (nombre, categoria, precio, descripcion, imagen) => {
    try {
      const nuevoProducto = await createProducto(nombre, categoria, precio, descripcion, imagen);
      productos.value.push(nuevoProducto); // Añade el producto recién creado al listado local
    } catch (error) {
      console.error('Error al crear producto:', error.message);
      throw error;
    }
  };

  // Obtener un producto por ID (para detalles o edición)
  const getProductoById = async (id) => {
    try {
      return await obtenerProducto(id);
    } catch (error) {
      console.error('Error al obtener producto:', error.message);
      throw error;
    }
  };

  // Editar un producto
  const updateProducto = async (id, data) => {
    try {
      await modificarProducto(id, data);
      // Actualiza el producto en el listado local
      const index = productos.value.findIndex((producto) => producto.id === id);
      if (index !== -1) {
        productos.value[index] = { ...productos.value[index], ...data };
      }
    } catch (error) {
      console.error('Error al modificar producto:', error.message);
      throw error;
    }
  };

  return {
    productos,
    currentPage,
    hasMorePages,
    isLoading,
    loadProductos,
    deleteProducto,
    createProductoInStore,
    getProductoById,
    updateProducto,
  };
});
