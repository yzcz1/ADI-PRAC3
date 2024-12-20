import { 
    auth, 
    db, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    sendPasswordResetEmail, 
    setDoc, 
    doc, 
    getDoc // Importa getDoc para leer datos de Firestore
} from '@/config/firebase'; // Alias para la configuración de Firebase

/**
 * Registrar un nuevo usuario.
 * @param {string} email
 * @param {string} password
 * @param {string} nombre
 * @param {string} apellidos
 * @param {number} edad
 * @returns {Promise<Object>} El usuario registrado.
 */
async function registerUser(email, password, nombre, apellidos, edad) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Guardar datos del usuario en Firestore
        await setDoc(doc(db, 'users', user.uid), {
            nombre,
            apellidos,
            edad,
            email,
            rol: 'usuario', // Rol por defecto
        });

        console.log('Usuario registrado con éxito.');
        return user; // Devuelve el usuario registrado
    } catch (error) {
        console.error('Error al registrar el usuario:', error.message);
        throw error; // Reenvía el error para manejarlo en el frontend
    }
}

/**
 * Iniciar sesión con email y contraseña.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object>} El usuario autenticado con datos adicionales.
 */
async function loginUser(email, password) {
    try {
        // Autentica al usuario con Firebase Authentication
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Verifica que se obtuvo el UID correctamente
        console.log('UID del usuario autenticado:', user.uid);

        // Obtiene datos adicionales del usuario desde Firestore
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            throw new Error('El usuario no tiene datos en Firestore.');
        }

        // Combina los datos de autenticación con los datos adicionales de Firestore
        const userData = {
            uid: user.uid,
            email: user.email,
            ...userDoc.data(), // Incluye datos como nombre, apellidos, rol, etc.
        };

        console.log('Datos completos del usuario:', userData); // Depuración
        return userData; // Devuelve los datos completos del usuario
    } catch (error) {
        console.error('Error al iniciar sesión:', error.message);
        throw error;
    }
}


/**
 * Cerrar sesión del usuario actual.
 * @returns {Promise<void>}
 */
async function logoutUser() {
    try {
        await signOut(auth);
        console.log('Sesión cerrada exitosamente.');
    } catch (error) {
        console.error('Error al cerrar sesión:', error.message);
        throw error;
    }
}

/**
 * Enviar correo para restablecer la contraseña.
 * @param {string} email
 * @returns {Promise<void>}
 */
async function forgotPassword(email) {
    try {
        await sendPasswordResetEmail(auth, email);
        console.log('Correo de restablecimiento enviado.');
    } catch (error) {
        console.error('Error al enviar correo de restablecimiento:', error.message);
        throw error;
    }
}

export { registerUser, loginUser, logoutUser, forgotPassword };
