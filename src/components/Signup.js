import React, { useState, useEffect, useRef } from 'react';
import logo from '../assets/img/ico_logo.png';

function Signup({ onSignupSuccess, onBackToLogin }) {
  // 이메일 인증 관련 상태
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [sentCode, setSentCode] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0); // 남은 시간 (초)
  const timerRef = useRef(null);

  // 사용자 정보 입력 상태
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [thumbnail, setThumbnail] = useState(''); // 썸네일 이미지 (base64)

  // 토스트 상태
  const [toast, setToast] = useState({ show: false, message: '' });
  const toastTimerRef = useRef(null);

  // 타이머 효과
  useEffect(() => {
    if (timeLeft > 0 && !isEmailVerified) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            showToast('인증번호가 만료되었습니다. 재전송해주세요.');
            setSentCode(''); // 만료된 코드 초기화
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [timeLeft, isEmailVerified]);

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
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

  // 시간을 mm:ss 형식으로 변환
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // 썸네일 업로드 핸들러
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 파일 크기 체크 (2MB 제한)
      if (file.size > 2 * 1024 * 1024) {
        showToast('이미지 크기는 2MB 이하여야 합니다.');
        return;
      }

      // 이미지 파일인지 확인
      if (!file.type.startsWith('image/')) {
        showToast('이미지 파일만 업로드 가능합니다.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnail(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // 썸네일 제거
  const removeThumbnail = () => {
    setThumbnail('');
  };

  // 이메일 유효성 검사
  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // 비밀번호 유효성 검사 (6자리 이상, 영문+숫자+특수문자)
  const isPasswordValid = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;
    return passwordRegex.test(password);
  };

  // 인증번호 전송
  const handleSendVerification = () => {
    if (!isEmailValid(email)) {
      showToast('올바른 이메일 형식이 아닙니다.');
      return;
    }

    // 이미 가입된 이메일인지 확인
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.email === email)) {
      showToast('이미 가입된 이메일입니다.');
      return;
    }

    // 랜덤 6자리 숫자 생성
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setSentCode(code);
    setIsCodeSent(true);
    setTimeLeft(180); // 3분 = 180초
    setVerificationCode(''); // 입력한 인증번호 초기화

    // 실제로는 이메일 전송 API를 호출해야 하지만, 
    // 프론트엔드 개발용으로 콘솔에 출력
    console.log(`[인증번호] ${email}로 전송된 인증번호: ${code}`);
    showToast(`인증번호가 전송되었습니다! (개발용: ${code})`);
  };

  // 인증번호 확인
  const handleVerifyCode = () => {
    if (timeLeft === 0) {
      showToast('인증번호가 만료되었습니다. 재전송해주세요.');
      return;
    }

    if (verificationCode === sentCode) {
      setIsEmailVerified(true);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      showToast('이메일 인증이 완료되었습니다.');
    } else {
      showToast('인증번호가 일치하지 않습니다.');
    }
  };

  // 회원가입 버튼 활성화 여부
  const isFormValid = () => {
    return (
      isEmailVerified &&
      name.trim() !== '' &&
      nickname.trim() !== '' &&
      password !== '' &&
      confirmPassword !== '' &&
      isPasswordValid(password) &&
      password === confirmPassword
    );
  };

  // 회원가입 처리
  const handleSignup = (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      showToast('모든 필드를 올바르게 입력해주세요.');
      return;
    }

    if (password !== confirmPassword) {
      showToast('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (!isPasswordValid(password)) {
      showToast('비밀번호는 6자리 이상, 영문+숫자+특수문자 조합이어야 합니다.');
      return;
    }

    // 사용자 정보 저장
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    users.push({
      email,
      password,
      name,
      nickname,
      thumbnail: thumbnail || '', // 썸네일이 없으면 빈 문자열
      createdAt: new Date().toISOString()
    });
    localStorage.setItem('users', JSON.stringify(users));

    // 자동 로그인
    localStorage.setItem('currentUser', email);
    showToast('회원가입이 완료되었습니다!');
    setTimeout(() => {
      onSignupSuccess(email);
    }, 1000);
  };

  return (
    <div className="login-container">
      <div className="login-box signup-box">
        <div className="login-header">
          <h1 className="login-title">
            회원가입
            <img src={logo} alt="Todoit Logo" className="login-logo" />
          </h1>
          <p className="login-subtitle">새로운 계정을 만들어주세요</p>
        </div>

        <form onSubmit={handleSignup} className="login-form">
          {/* 이메일 인증 섹션 */}
          <div className="login-form-group">
            <label htmlFor="email" className="form-label">이메일</label>
            <div className="input-with-button">
              <input
                id="email"
                type="email"
                className="text-input"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isEmailVerified}
                readOnly={isEmailVerified}
              />
              <button
                type="button"
                className="btn-common btn-primary btn-verify"
                onClick={handleSendVerification}
                disabled={!isEmailValid(email) || isEmailVerified}
              >
                {isCodeSent ? '재전송' : '인증'}
              </button>
            </div>
          </div>

          {isCodeSent && !isEmailVerified && (
            <div className="login-form-group">
              <label htmlFor="verificationCode" className="form-label">인증번호</label>
              <div className="input-with-button">
                <div className="input-with-timer">
                  <input
                    id="verificationCode"
                    type="text"
                    className="text-input"
                    placeholder="6자리 숫자"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    maxLength={6}
                    disabled={timeLeft === 0}
                  />
                  {timeLeft > 0 && (
                    <span className="timer-text">{formatTime(timeLeft)}</span>
                  )}
                </div>
                <button
                  type="button"
                  className="btn-common btn-primary  btn-verify"
                  onClick={handleVerifyCode}
                  disabled={verificationCode.length !== 6 || timeLeft === 0}
                >
                   확인
                 </button>
               </div>
             </div>
           )}

          {/* 사용자 정보 입력 섹션 */}
          <div className="user-info-section">
            <div className="user-info-left">
              <div className="login-form-group">
                <label htmlFor="name" className="form-label">사용자 이름</label>
                <input
                  id="name"
                  type="text"
                  className="text-input"
                  placeholder="홍길동"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="login-form-group">
                <label htmlFor="nickname" className="form-label">닉네임</label>
                <input
                  id="nickname"
                  type="text"
                  className="text-input"
                  placeholder="멋진닉네임"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                />
              </div>
            </div>

            <div className="user-info-right">
              <label className="form-label screen-out">썸네일</label>
              <div className="thumbnail-upload">
                <input
                  type="file"
                  id="thumbnail"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  style={{ display: 'none' }}
                />
                <div className="thumbnail-wrapper">
                  <label htmlFor="thumbnail" className="thumbnail-preview">
                    {thumbnail ? (
                      <img src={thumbnail} alt="썸네일 미리보기" className="thumbnail-image" />
                    ) : (
                      <div className="thumbnail-placeholder">
                        <img src={logo} alt="기본 썸네일" className="thumbnail-default-icon" />
                      </div>
                    )}
                  </label>
                  {thumbnail && (
                    <button
                      type="button"
                      className="thumbnail-remove"
                      onClick={(e) => {
                        e.preventDefault();
                        removeThumbnail();
                      }}
                      aria-label="썸네일 제거"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="login-form-group">
            <label htmlFor="password" className="form-label">비밀번호</label>
            <input
              id="password"
              type="password"
              className="text-input"
              placeholder="6자리 이상, 영문+숫자+특수문자"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
            {password && !isPasswordValid(password) && (
              <p className="input-hint error">
                6자리 이상, 영문+숫자+특수문자 조합이어야 합니다.
              </p>
            )}
          </div>

          <div className="login-form-group">
            <label htmlFor="confirmPassword" className="form-label">비밀번호 확인</label>
            <input
              id="confirmPassword"
              type="password"
              className="text-input"
              placeholder="비밀번호를 다시 입력해주세요"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />
            {confirmPassword && password !== confirmPassword && (
              <p className="input-hint error">비밀번호가 일치하지 않습니다.</p>
            )}
          </div>

          <button
            type="submit"
            className="btn-common btn-primary"
            disabled={!isFormValid()}
          >
            가입하기
          </button>
        </form>

        <div className="login-footer">
          <button
            type="button"
            className="login-toggle-btn"
            onClick={onBackToLogin}
          >
            이미 계정이 있으신가요? 로그인
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

export default Signup;
