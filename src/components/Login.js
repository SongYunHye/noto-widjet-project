import React, { useState } from 'react';
import logo from '../assets/img/ico_logo.png';

function Login({ onLogin }) {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // 유효성 검사
    if (!email || !password) {
      setError('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    if (isSignup && password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (isSignup) {
      // 회원가입
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // 이미 존재하는 이메일인지 확인
      if (users.find(u => u.email === email)) {
        setError('이미 존재하는 이메일입니다.');
        return;
      }

      // 새 사용자 추가
      users.push({ email, password });
      localStorage.setItem('users', JSON.stringify(users));
      
      // 자동 로그인
      localStorage.setItem('currentUser', email);
      onLogin(email);
    } else {
      // 로그인
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.email === email && u.password === password);
      
      if (user) {
        localStorage.setItem('currentUser', email);
        onLogin(email);
      } else {
        setError('이메일 또는 비밀번호가 올바르지 않습니다.');
      }
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
          <p className="login-subtitle">
            {isSignup ? '새로운 계정을 만들어주세요' : '로그인하여 시작하세요'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="login-error">{error}</div>}
          
          <div className="login-form-group">
            <label htmlFor="email" className="login-label">이메일</label>
            <input
              id="email"
              type="email"
              className="login-input"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="login-form-group">
            <label htmlFor="password" className="login-label">비밀번호</label>
            <input
              id="password"
              type="password"
              className="login-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={isSignup ? "new-password" : "current-password"}
            />
          </div>

          {isSignup && (
            <div className="login-form-group">
              <label htmlFor="confirmPassword" className="login-label">비밀번호 확인</label>
              <input
                id="confirmPassword"
                type="password"
                className="login-input"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>
          )}

          <button type="submit" className="btn-common btn-primary">
            {isSignup ? '회원가입' : '로그인'}
          </button>

          <button type="button" className="btn-common btn-gray" onClick={handleTestLogin}>
            테스트 로그인 (빠른 시작)
          </button>
        </form>

        <div className="login-footer">
          <button 
            type="button"
            className="login-toggle-btn"
            onClick={() => {
              setIsSignup(!isSignup);
              setError('');
              setConfirmPassword('');
            }}
          >
            {isSignup ? '이미 계정이 있으신가요? 로그인' : '계정이 없으신가요? 회원가입'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
