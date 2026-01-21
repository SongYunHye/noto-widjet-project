import React from 'react';
import Checkbox from './Checkbox';

function TodoItem({ todo, onToggle, onToggleFavorite, onDelete, onEdit, onDragStart, onDragOver, onDragEnd }) {
  // 텍스트 길이가 30자 이상이면 전체 너비 사용
  const isLongText = todo.text.length > 30;
  
  return (
    <div 
      className={`todo-item ${todo.completed ? 'completed' : ''} ${!todo.completed ? 'draggable' : ''} ${isLongText ? 'todo-item-long' : ''}`}
      draggable={!todo.completed}
      onDragStart={() => !todo.completed && onDragStart && onDragStart(todo)}
      onDragOver={(e) => !todo.completed && onDragOver && onDragOver(e, todo)}
      onDragEnd={() => !todo.completed && onDragEnd && onDragEnd()}
    >
      <div className="drag-handle" title="드래그하여 순서 변경">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="5" r="1"/>
          <circle cx="9" cy="12" r="1"/>
          <circle cx="9" cy="19" r="1"/>
          <circle cx="15" cy="5" r="1"/>
          <circle cx="15" cy="12" r="1"/>
          <circle cx="15" cy="19" r="1"/>
        </svg>
      </div>
      
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
          className={`todo-action-btn favorite ${todo.isFavorite ? 'active' : ''}`}
          disabled={todo.completed}
          onClick={() => onToggleFavorite(todo.id)}
          title={todo.isFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가"}
        >
          {todo.isFavorite ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
            </svg>
          )}
        </button>
        <button
          className="todo-action-btn edit"
          disabled={todo.completed}
          onClick={() => onEdit(todo)}
          title="수정"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pen-icon lucide-pen"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/></svg>
        </button>
        <button
          className="todo-action-btn delete"
          disabled={todo.completed}
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
