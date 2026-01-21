import React, { useState, useEffect } from 'react';
import './App.scss';
import 'react-datepicker/dist/react-datepicker.css';
import Login from './components/Login';
import TodoApp from './components/TodoApp';

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  // 로그인 체크
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(savedUser);
    }
  }, []);

  // 로그인 핸들러
  const handleLogin = (email) => {
    setCurrentUser(email);
  };

  // 로그아웃 핸들러
  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  };

  // 로그인하지 않은 경우 로그인 페이지 표시
  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  // 로그인한 경우 Todo 앱 표시
  return <TodoApp currentUser={currentUser} onLogout={handleLogout} />;
}

export default App;
