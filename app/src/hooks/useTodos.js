import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';

export function useTodos() {
  // useLiveQuery 会自动订阅数据库变化并更新组件
  // 默认返回空数组以防止加载时报错
  const todos = useLiveQuery(() => 
    db.todos.orderBy('createdAt').reverse().toArray()
  ) || [];

  const addTodo = async (text, isImportant, isUrgent) => {
    const newTodo = {
      id: crypto.randomUUID(),
      text,
      isImportant,
      isUrgent,
      completed: false,
      createdAt: Date.now(),
      subTasks: []
    };
    await db.todos.add(newTodo);
    return newTodo;
  };

  const toggleTodo = async (id) => {
    const todo = await db.todos.get(id);
    if (todo) {
      await db.todos.update(id, { completed: !todo.completed });
    }
  };

  const deleteTodo = async (id) => {
    await db.todos.delete(id);
  };

  const addSubTask = async (todoId, text) => {
    const todo = await db.todos.get(todoId);
    if (todo) {
      const newSubTask = {
        id: crypto.randomUUID(),
        text,
        completed: false
      };
      // IndexedDB 支持存储对象数组，直接更新 subTasks 字段
      await db.todos.update(todoId, {
        subTasks: [...todo.subTasks, newSubTask]
      });
    }
  };

  const toggleSubTask = async (todoId, subTaskId) => {
    const todo = await db.todos.get(todoId);
    if (todo) {
      const updatedSubTasks = todo.subTasks.map(sub =>
        sub.id === subTaskId ? { ...sub, completed: !sub.completed } : sub
      );
      await db.todos.update(todoId, { subTasks: updatedSubTasks });
    }
  };

  const updateTodo = async (id, newText) => {
    await db.todos.update(id, { text: newText });
  };

  const updateSubTask = async (todoId, subTaskId, newText) => {
    const todo = await db.todos.get(todoId);
    if (todo) {
      const updatedSubTasks = todo.subTasks.map(sub =>
        sub.id === subTaskId ? { ...sub, text: newText } : sub
      );
      await db.todos.update(todoId, { subTasks: updatedSubTasks });
    }
  };

  const moveTodoToQuadrant = async (todoId, quadrantId) => {
    let isImportant = false;
    let isUrgent = false;

    switch (quadrantId) {
      case 'q1': // Do First
        isImportant = true;
        isUrgent = true;
        break;
      case 'q2': // Schedule
        isImportant = true;
        isUrgent = false;
        break;
      case 'q3': // Delegate
        isImportant = false;
        isUrgent = true;
        break;
      case 'q4': // Eliminate
        isImportant = false;
        isUrgent = false;
        break;
    }

    await db.todos.update(todoId, { isImportant, isUrgent });
  };

  return {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
    addSubTask,
    toggleSubTask,
    updateSubTask,
    moveTodoToQuadrant
  };
}
