import React, { useState, useEffect, useRef } from 'react';
import logo from '../assets/img/ico_logo.png';

function Login({ onLogin, onGoToSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // 토스트 상태
  const [toast, setToast] = useState({ show: false, message: '' });
  const toastTimerRef = useRef(null);

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  // 토스트 표시 함수
  const showToast = (message) => {
    setToast({ show: true, message });
    
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    
    toastTimerRef.current = setTimeout(() => {
      setToast({ show: false, message: '' });
    }, 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 유효성 검사
    if (!email || !password) {
      showToast('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    // 로그인
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      localStorage.setItem('currentUser', email);
      onLogin(email);
    } else {
      showToast('이메일 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  // 테스트 로그인 (개발용)
  const handleTestLogin = () => {
    const testEmail = 'test@test.com';
    localStorage.setItem('currentUser', testEmail);
    onLogin(testEmail);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1 className="login-title">Todoit<img src={logo} alt="Todoit Logo" className="login-logo" /></h1>
          <p className="login-subtitle">Start with Todoit!</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-form-group">
            <label htmlFor="email" className="form-label">이메일</label>
            <input
              id="email"
              type="email"
              className="text-input"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="login-form-group">
            <label htmlFor="password" className="form-label">비밀번호</label>
            <input
              id="password"
              type="password"
              className="text-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="btn-common btn-primary">
            로그인
          </button>

          <button type="button" className="btn-common btn-gray" onClick={handleTestLogin}>
            테스트 로그인 (빠른 시작)
          </button>
        </form>

        <div className="login-footer">
          <button 
            type="button"
            className="login-toggle-btn"
            onClick={onGoToSignup}
          >
            계정이 없으신가요? 회원가입
          </button>
        </div>
      </div>

      {/* 토스트 메시지 */}
      {toast.show && (
        <div className="toast-message">
          {toast.message}
        </div>
      )}
    </div>
  );
}

export default Login;
