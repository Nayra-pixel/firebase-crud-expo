// src/repositories/TodoRepository.js
import { ref, push, set, update, remove, onValue } from 'firebase/database';
import FirebaseClient from '../services/FirebaseClient';
import Todo from '../models/Todo';


class TodoRepository {
constructor() {
this.db = FirebaseClient.getInstance().db;
this.collectionRef = ref(this.db, 'todos'); // raiz da coleção
}


/**
* Observa alterações em tempo real na coleção de todos.
* @param {(todos: Todo[]) => void} callback
* @returns {() => void} função para cancelar a inscrição
*/
subscribe(callback) {
const unsubscribe = onValue(this.collectionRef, (snapshot) => {
const data = snapshot.val() || {};
const list = Object.entries(data)
.map(([id, value]) => new Todo({ id, ...value }))
.sort((a, b) => b.createdAt - a.createdAt);
callback(list);
});
return unsubscribe; // chamar no cleanup do useEffect
}


/** Cria um novo todo e retorna o id gerado */
async create(todo) {
    const newRef = push(this.collectionRef);
    const id = newRef.key;
    const payload = new Todo({ id, ...todo }).toJSON();
  
    // força salvar o id dentro do nó
    await set(newRef, { id, ...payload });
    return id;
  }
w  


/** Atualiza campos parciais do todo */
async update(id, partial) {
const itemRef = ref(this.db, `todos/${id}`);
await update(itemRef, { ...partial, updatedAt: Date.now() });
}


/** Alterna o campo done */
async toggleDone(id, nextDone) {
await this.update(id, { done: nextDone });
}


/** Exclui o todo */
async delete(id) {
const itemRef = ref(this.db, `todos/${id}`);
await remove(itemRef);
}
}


export default TodoRepository;