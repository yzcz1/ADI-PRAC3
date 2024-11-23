import { getDoc, doc } from 'firebase/firestore';
import { db } from '@/config/firebase'; // Asegúrate de tener correctamente configurado Firebase

/**
 * Obtener datos de un usuario desde Firestore.
 * @param {string} userId El ID del usuario (uid).
 * @returns {Promise<Object>} Los datos del usuario.
 */
export async function getUserData(userId) {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data(); // Devuelve los datos del usuario
    } else {
      throw new Error('Usuario no encontrado.');
    }
  } catch (error) {
    console.error('Error al obtener datos del usuario:', error.message);
    throw error; // Reenvía el error para manejarlo en el frontend
  }
}
