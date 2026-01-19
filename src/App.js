import React, { useState, useEffect } from 'react';
import './App.scss';
import logo from './assets/img/ico_logo.png';
import TodoItem from './components/TodoItem';
import TagInput from './components/TagInput';

function App() {
  // 오늘 날짜를 YYYY-MM-DD 형식으로 가져오기
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // 주의 시작일(일요일) 계산
  const getWeekStartFromDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDay(); // 0(일요일) ~ 6(토요일)
    const diff = date.getDate() - day;
    const weekStart = new Date(date.setDate(diff));
    return weekStart.toISOString().split('T')[0];
  };

  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [dueDate, setDueDate] = useState(getTodayDate());
  const [tag, setTag] = useState(''); // 태그
  const [filter, setFilter] = useState('all'); // all, active, completed
  const [selectedDate, setSelectedDate] = useState(getTodayDate()); // Daily 탭에서 선택된 날짜
  const [selectedWeekStart, setSelectedWeekStart] = useState(getWeekStartFromDate(getTodayDate())); // Weekly 탭에서 선택된 주의 시작일
  const [selectedMonth, setSelectedMonth] = useState(getTodayDate()); // Monthly 탭에서 선택된 월
  const [addPopupOpen, setAddPopupOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null); // 수정 중인 todo
  const [deleteConfirmId, setDeleteConfirmId] = useState(null); // 삭제 확인 중인 todo id
  const [isClosingPopup, setIsClosingPopup] = useState(false); // 팝업 닫는 애니메이션 중
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuDetailPage, setMenuDetailPage] = useState(null); // 'background' 등
  const [backgroundType, setBackgroundType] = useState('memo'); // 'note', 'memo', 'grid'

  // 디바이스 감지
  useEffect(() => {
    const checkDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const mobileCheck = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      const widthCheck = window.innerWidth <= 768;
      setIsMobile(mobileCheck || widthCheck);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // 로컬 스토리지에서 불러오기
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      try {
        setTodos(JSON.parse(savedTodos));
      } catch (e) {
        console.error('Failed to parse todos:', e);
      }
    }
  }, []);

  // 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);


  // 기존 태그 목록 (유니크한 태그만)
  const existingTags = [...new Set(todos.map(todo => todo.tag).filter(Boolean))];

  // 투두 추가
  const addTodo = (e) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;

    const newTodo = {
      id: Date.now(),
      text: inputValue.trim(),
      completed: false,
      dueDate: dueDate || null,
      tag: tag.trim() || null,
      createdAt: new Date().toISOString()
    };

    setTodos([...todos, newTodo]);
    closePopup(); // 팝업 닫기 (애니메이션 포함)
  };

  // 투두 토글 (완료/미완료)
  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  // 삭제 확인 팝업 열기
  const openDeleteConfirm = (id) => {
    setDeleteConfirmId(id);
  };

  // 삭제 확인 팝업 닫기
  const closeDeleteConfirm = () => {
    setDeleteConfirmId(null);
  };

  // 투두 삭제
  const confirmDelete = () => {
    if (deleteConfirmId) {
      setTodos(todos.filter(todo => todo.id !== deleteConfirmId));
      closeDeleteConfirm();
    }
  };

  // 수정 팝업 열기
  const openEditPopup = (todo) => {
    setEditingTodo(todo);
    setInputValue(todo.text);
    setDueDate(todo.dueDate || getTodayDate());
    setTag(todo.tag || '');
  };

  // 투두 수정 저장
  const saveEditTodo = (e) => {
    e.preventDefault();
    if (!editingTodo || inputValue.trim() === '') return;

    setTodos(todos.map(todo =>
      todo.id === editingTodo.id ? { ...todo, text: inputValue.trim(), dueDate: dueDate, tag: tag.trim() || null } : todo
    ));
    closePopup(); // 팝업 닫기 (애니메이션 포함)
  };

  // 팝업 닫기 (애니메이션 포함)
  const closePopup = () => {
    setIsClosingPopup(true);
    setTimeout(() => {
      setAddPopupOpen(false);
      setEditingTodo(null);
      setInputValue('');
      setDueDate(getTodayDate());
      setTag('');
      setIsClosingPopup(false);
    }, 300); // 애니메이션 시간과 동일
  };

  // 날짜 포맷팅 (YYYY.MM.DD)
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  };

  // 이전 날짜로 이동
  const goToPreviousDay = () => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() - 1);
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  // 다음 날짜로 이동
  const goToNextDay = () => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + 1);
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  // 주의 시작일(일요일) 계산
  const getWeekStart = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDay(); // 0(일요일) ~ 6(토요일)
    const diff = date.getDate() - day;
    const weekStart = new Date(date.setDate(diff));
    return weekStart.toISOString().split('T')[0];
  };

  // 주의 종료일(토요일) 계산
  const getWeekEnd = (weekStartString) => {
    const date = new Date(weekStartString);
    date.setDate(date.getDate() + 6);
    return date.toISOString().split('T')[0];
  };

  // 주 범위 포맷팅 (YYYY.MM.DD ~ YYYY.MM.DD)
  const formatWeekRange = (weekStartString) => {
    const start = formatDate(weekStartString);
    const end = formatDate(getWeekEnd(weekStartString));
    return `${start} ~ ${end}`;
  };

  // 이전 주로 이동
  const goToPreviousWeek = () => {
    const date = new Date(selectedWeekStart);
    date.setDate(date.getDate() - 7);
    setSelectedWeekStart(date.toISOString().split('T')[0]);
  };

  // 다음 주로 이동
  const goToNextWeek = () => {
    const date = new Date(selectedWeekStart);
    date.setDate(date.getDate() + 7);
    setSelectedWeekStart(date.toISOString().split('T')[0]);
  };

  // 월 포맷팅 (YYYY.MM)
  const formatMonth = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}.${month}`;
  };

  // 이전 달로 이동
  const goToPreviousMonth = () => {
    const date = new Date(selectedMonth);
    date.setMonth(date.getMonth() - 1);
    setSelectedMonth(date.toISOString().split('T')[0]);
  };

  // 다음 달로 이동
  const goToNextMonth = () => {
    const date = new Date(selectedMonth);
    date.setMonth(date.getMonth() + 1);
    setSelectedMonth(date.toISOString().split('T')[0]);
  };

  // 필터링된 투두 리스트
  const filteredTodos = todos.filter(todo => {
    // Daily 탭: 선택된 날짜의 할 일만 표시
    if (filter === 'all') {
      return todo.dueDate === selectedDate;
    }
    // Weekly 탭: 선택된 주의 할 일만 표시 (일~토)
    if (filter === 'active') {
      if (!todo.dueDate) return false;
      const todoDate = new Date(todo.dueDate);
      const weekStart = new Date(selectedWeekStart);
      const weekEnd = new Date(getWeekEnd(selectedWeekStart));
      return todoDate >= weekStart && todoDate <= weekEnd;
    }
    // Monthly 탭: 선택된 월의 할 일만 표시
    if (filter === 'completed') {
      if (!todo.dueDate) return false;
      const todoMonth = formatMonth(todo.dueDate);
      const selectedMonthFormat = formatMonth(selectedMonth);
      return todoMonth === selectedMonthFormat;
    }
    return true;
  });

  // 태그별로 그룹화
  const groupedByTag = filteredTodos.reduce((groups, todo) => {
    const tagName = todo.tag || null;
    if (!groups[tagName]) {
      groups[tagName] = [];
    }
    groups[tagName].push(todo);
    return groups;
  }, {});

  // 태그가 있는 그룹들과 태그가 없는 그룹을 분리
  const taggedGroups = Object.entries(groupedByTag).filter(([tag]) => tag !== 'null');
  const untaggedTodos = groupedByTag['null'] || [];


  return (
    <div className={`App ${isMobile ? 'mobile' : 'desktop'}`}>
      {/* 메뉴 오버레이 */}
      {menuOpen && (
        <div 
          className="menu-overlay" 
          onClick={() => {
            setMenuOpen(false);
            setMenuDetailPage(null);
          }}
        />
      )}

      {/* 사이드 메뉴 */}
      <aside className={`side-menu ${menuOpen ? 'open' : ''}`}>
        {/* 메인 메뉴 */}
        {!menuDetailPage && (
          <>
            <div className="side-menu-header">
              <button 
                className="close-menu-btn" 
                onClick={() => setMenuOpen(false)}
                aria-label="메뉴 닫기"
              >
                ✕
              </button>
            </div>
            <nav className="side-menu-nav">
              <ul>
                <li onClick={() => setMenuOpen(false)}>
                  <span>홈</span>
                </li>
                <li onClick={() => setMenuDetailPage('background')}>
                  <span>배경 설정</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </li>
              </ul>
            </nav>
            <div className="side-menu-footer">
              <p>© dea. All rights reserved.</p>
            </div>
          </>
        )}

        {/* 배경 설정 상세 페이지 */}
        {menuDetailPage === 'background' && (
          <>
            <div className="side-menu-header detail">
              <button 
                className="back-btn" 
                onClick={() => setMenuDetailPage(null)}
                aria-label="뒤로 가기"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              <h2>배경 설정</h2>
              <button 
                className="close-menu-btn" 
                onClick={() => {
                  setMenuOpen(false);
                  setMenuDetailPage(null);
                }}
                aria-label="메뉴 닫기"
              >
                ✕
              </button>
            </div>
            <div className="side-menu-detail">
              <ul className="option-list">
                <li 
                  className={backgroundType === 'note' ? 'active' : ''}
                  onClick={() => setBackgroundType('note')}
                >
                  <span>노트 타입</span>
                  {backgroundType === 'note' && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </li>
                <li 
                  className={backgroundType === 'memo' ? 'active' : ''}
                  onClick={() => setBackgroundType('memo')}
                >
                  <span>메모장 타입</span>
                  {backgroundType === 'memo' && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </li>
                <li 
                  className={backgroundType === 'grid' ? 'active' : ''}
                  onClick={() => setBackgroundType('grid')}
                >
                  <span>격자무늬 타입</span>
                  {backgroundType === 'grid' && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </li>
              </ul>
            </div>
            <div className="side-menu-footer">
              <p>© dea. All rights reserved.</p>
            </div>
          </>
        )}
      </aside>

      {/* 상단 헤더 바 */}
      <header className="top-header">
        <h1 className="app-title">
          Noto
          <img src={logo} alt="Todo Logo" className="app-logo" />
        </h1>
        {/* <button 
          className="write-btn" 
          onClick={() => setAddPopupOpen(true)}
          aria-label="할 일 작성"
        >
          <img src={writeIcon} alt="Write" className="write-icon" />
        </button> */}
        <button 
          className="menu-btn" 
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="메뉴"
        >
          <span className="menu-btn-icon"></span>
        </button>
      </header>

      <div className="container">
        <nav className="cont-nav">
          <ul>
            <li 
              className={filter === 'all' ? 'active' : ''}
              onClick={() => setFilter('all')}
            >
              <span>Daily</span>
            </li>
            <li 
              className={filter === 'active' ? 'active' : ''}
              onClick={() => setFilter('active')}
            >
              <span>Weekly</span>
            </li>
            <li 
              className={filter === 'completed' ? 'active' : ''}
              onClick={() => setFilter('completed')}
            >
              <span>Monthly</span>
            </li>
          </ul>
        </nav>

        {/* 날짜 네비게이션 (Daily 탭일 때만 표시) */}
        {filter === 'all' && (
          <div className="date-navigation">
            <button 
              className="date-nav-btn prev"
              onClick={goToPreviousDay}
              aria-label="이전 날짜"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <div className="selected-date">
              {formatDate(selectedDate)}
            </div>
            <button 
              className="date-nav-btn next"
              onClick={goToNextDay}
              aria-label="다음 날짜"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        )}

        {/* 주간 네비게이션 (Weekly 탭일 때만 표시) */}
        {filter === 'active' && (
          <div className="date-navigation">
            <button 
              className="date-nav-btn prev"
              onClick={goToPreviousWeek}
              aria-label="이전 주"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <div className="selected-date">
              {formatWeekRange(selectedWeekStart)}
            </div>
            <button 
              className="date-nav-btn next"
              onClick={goToNextWeek}
              aria-label="다음 주"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        )}

        {/* 월간 네비게이션 (Monthly 탭일 때만 표시) */}
        {filter === 'completed' && (
          <div className="date-navigation">
            <button 
              className="date-nav-btn prev"
              onClick={goToPreviousMonth}
              aria-label="이전 달"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <div className="selected-date">
              {formatMonth(selectedMonth)}
            </div>
            <button 
              className="date-nav-btn next"
              onClick={goToNextMonth}
              aria-label="다음 달"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        )}

        {/* 투두 리스트 */}
        <div className={`cont-todolist ${backgroundType}`}>
          {filteredTodos.length === 0 ? (
            <div className="empty-state">
              No data yet :(
            </div>
          ) : (
            <>
              {/* 태그가 있는 항목들 */}
              {taggedGroups.map(([tag, todos]) => (
                <div key={tag} className="todo-group">
                  <h3 className="todo-group-tag">#{tag}</h3>
                  {todos.map(todo => (
                    <TodoItem
                      key={todo.id}
                      todo={todo}
                      onToggle={toggleTodo}
                      onDelete={openDeleteConfirm}
                      onEdit={openEditPopup}
                    />
                  ))}
                </div>
              ))}
              
              {/* 태그가 없는 항목들 */}
              {untaggedTodos.length > 0 && (
                <div className="todo-group">
                  {untaggedTodos.map(todo => (
                    <TodoItem
                      key={todo.id}
                      todo={todo}
                      onToggle={toggleTodo}
                      onDelete={openDeleteConfirm}
                      onEdit={openEditPopup}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* 하단 네비게이션 */}
      <div className="nav">
        <div className="nav-first">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="feather feather-home" viewBox="0 0 24 24">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path>
          </svg>
          <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="css-i6dzq1" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="M21 21l-4.35-4.35"></path>
          </svg>
          <svg 
            className="btn-add nav-icon-bold" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 1000 1000"
            onClick={() => setAddPopupOpen(true)}
          >
            <path fill="currentColor" stroke="currentColor" strokeWidth="15" strokeLinejoin="round" d="M934 822H794v140c0 15.5-12.5 28-28 28s-28-12.5-28-28V822H598c-15.5 0-28-12.5-28-28s12.5-28 28-28h140V626c0-15.5 12.5-28 28-28s28 12.5 28 28v140h140c15.5 0 28 12.5 28 28s-12.5 28-28 28zM738 122c0-30.9-25.1-56-56-56H150c-30.9 0-56 25.1-56 56v756c0 30.9 25.1 56 56 56h364v56H122c-46.4 0-84-37.6-84-84V94c0-46.4 37.6-84 84-84h588c46.4 0 84 37.6 84 84v364h-56V122z"></path>
          </svg>
          <button className="btn-favorite">
            <svg className="ico-default-path"  fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
              <path className="default-path" d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path>
            </svg>
            <svg className="ico-default-active" xmlns="http://www.w3.org/2000/svg" viewBox="0 -28 512 512">
              <path fill="#EBC7E5" d="M471.383 44.578C444.879 15.832 408.512 0 368.973 0c-29.555 0-56.621 9.344-80.45 27.77C276.5 37.07 265.605 48.45 256 61.73c-9.602-13.277-20.5-24.66-32.527-33.96C199.648 9.344 172.582 0 143.027 0c-39.539 0-75.91 15.832-102.414 44.578C14.426 72.988 0 111.801 0 153.871c0 43.3 16.137 82.938 50.781 124.742 30.992 37.395 75.535 75.356 127.117 119.313 17.614 15.012 37.579 32.027 58.309 50.152A30.023 30.023 0 00256 455.516c7.285 0 14.316-2.641 19.785-7.43 20.73-18.129 40.707-35.152 58.328-50.172 51.575-43.95 96.117-81.906 127.11-119.305C495.867 236.81 512 197.172 512 153.867c0-42.066-14.426-80.879-40.617-109.289zm0 0" className="active-path" data-old_color="#000000" data-original="#000000"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* 하단 슬라이드 팝업 */}
      {(addPopupOpen || editingTodo) && (
        <>
          <div 
            className={`popup-overlay ${isClosingPopup ? 'closing' : ''}`}
            onClick={closePopup}
          />
          <div className={`bottom-sheet ${isClosingPopup ? 'closing' : ''}`}>
            <div className="bottom-sheet-handle"></div>
            <div className="bottom-sheet-header">
              <h2>{editingTodo ? 'Edit Plan' : 'New Plan'}</h2>
              <button 
                className="popup-close-btn"
                onClick={closePopup}
                aria-label="닫기"
              >
                ✕
              </button>
            </div>
            <form onSubmit={editingTodo ? saveEditTodo : addTodo} className="bottom-sheet-content">
              <div className="form-group">
                <label htmlFor="due-date" className="form-label">Date</label>
                <input
                  id="due-date"
                  type="date"
                  className="date-input"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="todo-tag" className="form-label">Tag</label>
                <TagInput 
                  value={tag}
                  onChange={setTag}
                  existingTags={existingTags}
                  placeholder="Enter or select a tag"
                />
              </div>
              <div className="form-group">
                <label htmlFor="todo-text" className="form-label">Plan</label>
                <textarea
                  id="todo-text"
                  className="popup-input"
                  placeholder="what is your plan?"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  autoFocus
                  rows={4}
                />
              </div>
              <div className="popup-actions">
                <button 
                  type="button"
                  className="popup-cancel-btn"
                  onClick={closePopup}
                >
                  취소
                </button>
                <button type="submit" className="popup-add-btn">
                  {editingTodo ? '수정' : '추가'}
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* 삭제 확인 팝업 */}
      {deleteConfirmId && (
        <>
          <div 
            className="popup-overlay" 
            onClick={closeDeleteConfirm}
          />
          <div className="confirm-dialog">
            <div className="confirm-dialog-content">
              <p className="confirm-message">일정을 삭제하시겠습니까?</p>
              <div className="confirm-actions">
                <button 
                  className="confirm-btn cancel"
                  onClick={closeDeleteConfirm}
                >
                  취소
                </button>
                <button 
                  className="confirm-btn confirm"
                  onClick={confirmDelete}
                >
                  확인
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
