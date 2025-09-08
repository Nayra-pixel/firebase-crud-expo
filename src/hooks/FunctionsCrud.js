import { useEffect, useState, useMemo } from "react";
import TodoRepository from "../repositories/TodoRepository";
import Todo from "../models/Todo";

export default function useTodos(user) {
  const repo = useMemo(() => new TodoRepository(), []);
  const [todos, setTodos] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = repo.subscribe(user.uid, setTodos);
    return () => unsubscribe && unsubscribe();
  }, [user, repo]);

  const createTodo = async (title) => {
    const trimmed = title.trim();
    if (!trimmed) throw new Error("Digite um título.");
    const todo = new Todo({ title: trimmed });
    await repo.create(user.uid, todo);
  };

  const updateTodo = async (id, title) => {
    const trimmed = title.trim();
    if (!trimmed) throw new Error("Digite um título.");
    await repo.update(user.uid, id, { title: trimmed });
  };

  const toggleTodo = async (id, done) => {
    await repo.toggleDone(user.uid, id, done);
  };

  const deleteTodo = async (id) => {
    await repo.delete(user.uid, id);
  };

  return {
    todos,
    editingId,
    setEditingId,
    createTodo,
    updateTodo,
    toggleTodo,
    deleteTodo,
  };
}
