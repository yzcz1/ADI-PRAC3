import { 
    db, 
    doc, 
    setDoc, 
    updateDoc, 
    deleteDoc, 
    getDocs, 
    getDoc, 
    collection, 
    query, 
    where, 
    orderBy, 
    startAfter, 
    limit,
    serverTimestamp // Para añadir la fecha de creación automáticamente
} from '@/config/firebase';

/**
 * Crear un nuevo comentario
 * @param {string} productoId ID del producto asociado.
 * @param {string} nombreUsuario Nombre del usuario que comenta.
 * @param {string} contenido Contenido del comentario.
 * @param {string} productoAsociado Nombre del producto asociado al comentario.
 * @returns {Promise<Object>} Comentario creado.
 */
async function crearComentario(productoId, nombreUsuario, contenido, productoAsociado) {
    try {
        const nuevoComentario = {
            productoId,
            nombreUsuario,
            contenido,
            productoAsociado,
            fechaCreacion: serverTimestamp(),
        };

        const comentarioRef = doc(collection(db, 'comentarios'));
        await setDoc(comentarioRef, nuevoComentario);
        return { id: comentarioRef.id, ...nuevoComentario };
    } catch (error) {
        console.error('Error al crear el comentario:', error.message);
        throw error;
    }
}

/**
 * Modificar un comentario
 * @param {string} comentarioId ID del comentario a modificar.
 * @param {string} nuevoContenido Nuevo contenido del comentario.
 * @returns {Promise<boolean>} `true` si el comentario fue modificado.
 */
async function modificarComentario(comentarioId, nuevoContenido) {
    try {
        const comentarioRef = doc(db, 'comentarios', comentarioId);
        await updateDoc(comentarioRef, {
            contenido: nuevoContenido,
        });
        return true;
    } catch (error) {
        console.error('Error al modificar comentario:', error.message);
        throw error;
    }
}

/**
 * Eliminar un comentario
 * @param {string} comentarioId ID del comentario a eliminar.
 * @returns {Promise<void>}
 */
async function eliminarComentario(comentarioId) {
    try {
        const comentarioRef = doc(db, 'comentarios', comentarioId);
        await deleteDoc(comentarioRef);
    } catch (error) {
        console.error('Error al eliminar el comentario:', error.message);
        throw error;
    }
}

/**
 * Listar comentarios por producto con paginación
 * @param {string} productoId ID del producto.
 * @param {number} limite Número de comentarios por página.
 * @param {DocumentSnapshot} lastVisible Último documento visible.
 * @returns {Promise<Object>} Lista de comentarios y última referencia visible.
 */
async function listarComentariosPorProducto(productoId, limite = 5, lastVisible = null) {
    try {
        let comentariosQuery = query(
            collection(db, "comentarios"),
            where("productoId", "==", productoId),
            orderBy("fechaCreacion", "desc"),
            limit(limite)
        );

        if (lastVisible) {
            comentariosQuery = query(comentariosQuery, startAfter(lastVisible));
        }

        const snapshot = await getDocs(comentariosQuery);

        if (snapshot.empty) {
            return { comentarios: [], lastVisible: null };
        }

        const comentarios = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const lastDoc = snapshot.docs[snapshot.docs.length - 1];
        return { comentarios, lastVisible: lastDoc };
    } catch (error) {
        console.error("Error al listar comentarios por producto:", error.message);
        throw error;
    }
}

export {
    crearComentario,
    modificarComentario,
    eliminarComentario,
    listarComentariosPorProducto,
};
