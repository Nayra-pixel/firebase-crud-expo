// src/models/Todo.js
class Todo {
    constructor({ id = null, title = '', done = false, createdAt = Date.now(), updatedAt = null }) {
    this.id = id;
    this.title = title.trim();
    this.done = !!done;
    this.createdAt = createdAt || Date.now();
    this.updatedAt = updatedAt;
    }
    
    
    toJSON() {
    // No Realtime Database, a chave (id) vira o caminho; não salvamos 'id' dentro do nó
    return {
    title: this.title,
    done: this.done,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
    };
    }
    }
    
    
    export default Todo;