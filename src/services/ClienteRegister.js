// src/services/ClienteService.js
import { ref, set, push } from 'firebase/database';
import { database } from '../firebaseConfig';

export const addCliente = async (cliente) => {
  try {
    const clientesRef = ref(database, 'clientes');
    const newClienteRef = push(clientesRef);
    await set(newClienteRef, cliente);
    return { success: true };
  } catch (error) {
    console.log("Erro ao cadastrar cliente:", error);
    return { success: false, error };
  }
};
