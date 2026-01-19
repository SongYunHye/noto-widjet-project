import React from 'react';
import Checkbox from './Checkbox';

function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <Checkbox
        id={`todo-${todo.id}`}
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      
      <div className="todo-content">
        <span className="todo-text">
          {todo.text}
        </span>
      </div>

      <div className="todo-actions">
        <button
          className="todo-action-btn edit"
          onClick={() => onEdit(todo)}
          title="수정"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pen-icon lucide-pen"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/></svg>
        </button>
        <button
          className="todo-action-btn delete"
          onClick={() => onDelete(todo.id)}
          title="삭제"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-icon lucide-trash"><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
        </button>
      </div>
    </div>
  );
}

export default TodoItem;
