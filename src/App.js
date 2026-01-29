import React, { useState, useEffect } from 'react';
import './App.scss';
import 'react-datepicker/dist/react-datepicker.css';
import Login from './components/Login';
import Signup from './components/Signup';
import TodoApp from './components/TodoApp';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isSignupPage, setIsSignupPage] = useState(false);

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
    setIsSignupPage(false);
  };

  // 로그아웃 핸들러
  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  };

  // 회원가입 성공 핸들러
  const handleSignupSuccess = (email) => {
    setCurrentUser(email);
    setIsSignupPage(false);
  };

  // 회원가입 페이지로 이동
  const goToSignup = () => {
    setIsSignupPage(true);
  };

  // 로그인 페이지로 이동
  const goToLogin = () => {
    setIsSignupPage(false);
  };

  // 로그인하지 않은 경우
  if (!currentUser) {
    if (isSignupPage) {
      return <Signup onSignupSuccess={handleSignupSuccess} onBackToLogin={goToLogin} />;
    }
    return <Login onLogin={handleLogin} onGoToSignup={goToSignup} />;
  }

  // 로그인한 경우 Todo 앱 표시
  return <TodoApp currentUser={currentUser} onLogout={handleLogout} />;
}

export default App;
