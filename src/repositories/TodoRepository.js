// src/repositories/TodoRepository.js
import { ref, push, set, update, remove, onValue } from "firebase/database";
import FirebaseClient from "../services/FirebaseClient";
import Todo from "../models/Todo";

class TodoRepository {
  constructor() {
    this.db = FirebaseClient.getInstance().db;
  }

  /**
   * Observa alterações em tempo real nas tarefas de um usuário.
   * @param {string} uid - ID do usuário logado
   * @param {(todos: Todo[]) => void} callback - função que recebe a lista atualizada
   * @returns {() => void} função para cancelar a inscrição
   */
  subscribe(uid, callback) {
    const userRef = ref(this.db, `todos/${uid}`);

    const unsubscribe = onValue(userRef, (snapshot) => {
      const data = snapshot.val() || {};
      const list = Object.entries(data)
        .map(([id, value]) => new Todo({ id, ...value }))
        .sort((a, b) => b.createdAt - a.createdAt);

      callback(list);
    });

    return unsubscribe; // chamar no cleanup do useEffect
  }

  /** Cria um novo todo e retorna o id gerado */
  async create(uid, todo) {
    const userRef = ref(this.db, `todos/${uid}`);
    const newRef = push(userRef);
    const id = newRef.key;
    const payload = new Todo({ id, ...todo }).toJSON();

    await set(newRef, { id, ...payload }); // garante salvar o id no nó

    return id;
  }


  /** Atualiza campos parciais do todo */
  async update(uid, id, partial) {
    const itemRef = ref(this.db, `todos/${uid}/${id}`);
    await update(itemRef, { ...partial, updatedAt: Date.now() });
  }

  /** Alterna o campo done */
  async toggleDone(uid, id, nextDone) {
    await this.update(uid, id, { done: nextDone });
  }

  /** Exclui o todo */
  async delete(uid, id) {
    const itemRef = ref(this.db, `todos/${uid}/${id}`);
    await remove(itemRef);
  }
}


export default TodoRepository;
