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
    limit 
} from '@/config/firebase';

/**
 * Obtener el próximo ID secuencial basado en el valor máximo actual
 * @returns {Promise<number>} Próximo ID secuencial.
 */
async function obtenerSiguienteIdSecuencialComentario() {
    try {
        const comentariosSnapshot = await getDocs(collection(db, "comentarios"));
        const comentarios = comentariosSnapshot.docs.map((doc) => doc.data());

        if (comentarios.length === 0) {
            return 1;
        }

        const maxIdSecuencial = Math.max(...comentarios.map(comentario => comentario.idSecuencial));
        return maxIdSecuencial + 1;
    } catch (error) {
        console.error("Error al obtener el siguiente ID secuencial:", error.message);
        return null;
    }
}

/**
 * Crear un nuevo comentario
 * @param {string} productoId ID del producto asociado.
 * @param {string} userId ID del usuario que comenta.
 * @param {string} contenido Contenido del comentario.
 * @returns {Promise<Object>} Comentario creado.
 */
async function crearComentario(productoId, userId, contenido) {
    try {
        const nextIdSecuencial = await obtenerSiguienteIdSecuencialComentario();
        const usuarioDoc = await getDoc(doc(db, 'users', userId));

        if (!usuarioDoc.exists()) {
            throw new Error("El usuario no existe.");
        }

        const usuarioData = usuarioDoc.data();
        const nuevoComentario = {
            idSecuencial: nextIdSecuencial,
            productoId,
            userId,
            nombreUsuario: usuarioData.nombre,
            apellidosUsuario: usuarioData.apellidos,
            contenido,
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
 * @param {string} comentarioIdSecuencial ID secuencial del comentario a modificar.
 * @param {string} userId ID del usuario que comenta.
 * @param {string} nuevoContenido Nuevo contenido del comentario.
 * @returns {Promise<boolean>} `true` si el comentario fue modificado.
 */
async function modificarComentario(comentarioIdSecuencial, userId, nuevoContenido) {
    try {
        const comentariosSnapshot = await getDocs(collection(db, 'comentarios'));
        const comentarios = comentariosSnapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id,
        }));

        const comentarioAModificar = comentarios.find(comentario => comentario.idSecuencial === comentarioIdSecuencial);

        if (!comentarioAModificar) {
            throw new Error("El comentario no existe.");
        }

        if (comentarioAModificar.userId !== userId) {
            throw new Error("No tienes permiso para modificar este comentario.");
        }

        await updateDoc(doc(db, 'comentarios', comentarioAModificar.id), {
            contenido: nuevoContenido,
        });

        return true;
    } catch (error) {
        console.error("Error al modificar comentario:", error.message);
        throw error;
    }
}

/**
 * Eliminar un comentario
 * @param {number} comentarioIdSecuencial ID secuencial del comentario a eliminar.
 * @returns {Promise<void>}
 */
async function eliminarComentario(comentarioIdSecuencial) {
    try {
        const comentariosSnapshot = await getDocs(collection(db, 'comentarios'));
        const comentarios = comentariosSnapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id,
        }));

        const comentarioAEliminar = comentarios.find(comentario => comentario.idSecuencial === comentarioIdSecuencial);

        if (!comentarioAEliminar) {
            throw new Error("El comentario no existe.");
        }

        await deleteDoc(doc(db, 'comentarios', comentarioAEliminar.id));
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
            orderBy("idSecuencial", "asc"),
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
