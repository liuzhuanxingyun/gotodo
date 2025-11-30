import { useState, useEffect } from 'react';

const STORAGE_KEY = 'gotodo-data';

export function useTodos() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const addTodo = (text, isImportant, isUrgent) => {
    const newTodo = {
      id: crypto.randomUUID(),
      text,
      isImportant,
      isUrgent,
      completed: false,
      createdAt: Date.now(),
      subTasks: []
    };
    setTodos(prev => [newTodo, ...prev]);
    return newTodo;
  };

  const toggleTodo = (id) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const addSubTask = (todoId, text) => {
    setTodos(prev => prev.map(todo => {
      if (todo.id === todoId) {
        return {
          ...todo,
          subTasks: [...todo.subTasks, {
            id: crypto.randomUUID(),
            text,
            completed: false
          }]
        };
      }
      return todo;
    }));
  };

  const toggleSubTask = (todoId, subTaskId) => {
    setTodos(prev => prev.map(todo => {
      if (todo.id === todoId) {
        return {
          ...todo,
          subTasks: todo.subTasks.map(sub =>
            sub.id === subTaskId ? { ...sub, completed: !sub.completed } : sub
          )
        };
      }
      return todo;
    }));
  };

  const updateTodo = (id, newText) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, text: newText } : todo
    ));
  };

  const updateSubTask = (todoId, subTaskId, newText) => {
    setTodos(prev => prev.map(todo => {
      if (todo.id === todoId) {
        return {
          ...todo,
          subTasks: todo.subTasks.map(sub =>
            sub.id === subTaskId ? { ...sub, text: newText } : sub
          )
        };
      }
      return todo;
    }));
  };

  const moveTodoToQuadrant = (todoId, quadrantId) => {
    setTodos(prev => prev.map(todo => {
      if (todo.id === todoId) {
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

        return { ...todo, isImportant, isUrgent };
      }
      return todo;
    }));
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
