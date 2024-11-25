import { 
    db, 
    doc, 
    collection, 
    setDoc, 
    updateDoc, 
    deleteDoc, 
    getDocs, 
    getDoc, 
    query, 
    where, 
    orderBy, 
    limit, 
    startAfter, 
    writeBatch 
} from '@/config/firebase';

/**
 * Crear un nuevo producto.
 * @param {string} nombre
 * @param {string} categoria
 * @param {number} precio
 * @param {string} descripcion
 * @param {string} imagen
 */
async function createProducto(nombre, categoria, precio, descripcion, imagen) {
    try {
        const productoRef = doc(collection(db, 'productos'));
        const newProducto = { nombre, categoria, precio, descripcion, imagen }; // Incluye la imagen
        await setDoc(productoRef, newProducto);
        console.log('Producto creado con éxito.');
        return { id: productoRef.id, ...newProducto };
    } catch (error) {
        console.error('Error al crear el producto:', error.message);
        throw error;
    }
}

/**
 * Obtener todos los productos con paginación.
 * @param {number} limite
 * @param {DocumentSnapshot} lastVisible
 */
async function listarProductos(limite = 6, lastVisible = null) {
    try {
        let productosQuery = query(collection(db, 'productos'), orderBy('nombre', 'asc'), limit(limite));
        if (lastVisible) {
            productosQuery = query(productosQuery, startAfter(lastVisible));
        }

        const snapshot = await getDocs(productosQuery);
        const productos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const lastDoc = snapshot.docs[snapshot.docs.length - 1];
        return { productos, lastVisible: lastDoc };
    } catch (error) {
        console.error('Error al listar productos:', error.message);
        throw error;
    }
}

/**
 * Obtener un producto por ID.
 * @param {string} id
 */
async function obtenerProducto(id) {
    try {
        const productoRef = doc(db, 'productos', id);
        const productoSnap = await getDoc(productoRef);
        if (!productoSnap.exists()) throw new Error('Producto no encontrado.');
        const producto = { id: productoSnap.id, ...productoSnap.data() };
        console.log('Producto obtenido:', producto); // Verifica los datos aquí
        return producto;
    } catch (error) {
        console.error('Error al obtener producto:', error.message);
        throw error;
    }
}


/**
 * Modificar un producto.
 * @param {string} id
 * @param {Object} data
 */
async function modificarProducto(id, data) {
    try {
        const productoRef = doc(db, 'productos', id);
        await updateDoc(productoRef, data);
        console.log('Producto modificado con éxito.');
    } catch (error) {
        console.error('Error al modificar producto:', error.message);
        throw error;
    }
}

/**
 * Eliminar un producto.
 * @param {string} id
 */
async function eliminarProducto(id) {
    try {
        const productoRef = doc(db, 'productos', id);
        await deleteDoc(productoRef);
        console.log('Producto eliminado con éxito.');
    } catch (error) {
        console.error('Error al eliminar producto:', error.message);
        throw error;
    }
}

export { createProducto, listarProductos, obtenerProducto, modificarProducto, eliminarProducto };
