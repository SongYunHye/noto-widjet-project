import React, { useState, useEffect } from 'react';
import logo from '../assets/img/ico_logo.png';
import TodoItem from './TodoItem';
import TagInput from './TagInput';
import Select from './Select';
import DatePicker from 'react-datepicker';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

function TodoApp({ currentUser, onLogout }) {
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
  const [dueDate, setDueDate] = useState(new Date());
  const [tag, setTag] = useState(''); // 태그
  const [filter, setFilter] = useState('all'); // all, active, completed (Daily, Weekly, Monthly)
  const [statusFilter, setStatusFilter] = useState('all'); // all, in-progress, complete
  const [selectedDate, setSelectedDate] = useState(getTodayDate()); // Daily 탭에서 선택된 날짜
  const [selectedWeekStart, setSelectedWeekStart] = useState(getWeekStartFromDate(getTodayDate())); // Weekly 탭에서 선택된 주의 시작일
  const [selectedMonth, setSelectedMonth] = useState(getTodayDate()); // Monthly 탭에서 선택된 월
  const [addPopupOpen, setAddPopupOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null); // 수정 중인 todo
  const [deleteConfirmId, setDeleteConfirmId] = useState(null); // 삭제 확인 중인 todo id
  const [isClosingPopup, setIsClosingPopup] = useState(false); // 팝업 닫는 애니메이션 중
  const [isClosingFavoritePopup, setIsClosingFavoritePopup] = useState(false); // 즐겨찾기 팝업 닫는 애니메이션 중
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isClosingMenu, setIsClosingMenu] = useState(false); // 메뉴 닫는 애니메이션 중
  const [menuDetailPage, setMenuDetailPage] = useState(null); // 'background' 등
  const [backgroundType, setBackgroundType] = useState('memo'); // 'note', 'memo', 'grid'
  const [searchPopupOpen, setSearchPopupOpen] = useState(false); // 검색 팝업
  const [searchKeyword, setSearchKeyword] = useState(''); // 검색 키워드
  const [selectedSearchTag, setSelectedSearchTag] = useState('all'); // 검색 태그 필터
  const [searchResults, setSearchResults] = useState([]); // 검색 결과
  const [hasSearched, setHasSearched] = useState(false); // 검색 실행 여부
  const [favoritePopupOpen, setFavoritePopupOpen] = useState(false); // 즐겨찾기 팝업
  const [tagColors, setTagColors] = useState({}); // 태그별 색상 매핑 {tagName: colorValue}
  const [colorPickerTag, setColorPickerTag] = useState(null); // 색상 선택 중인 태그
  const [editingTag, setEditingTag] = useState(null); // 편집 중인 태그
  const [editingTagValue, setEditingTagValue] = useState(''); // 편집 중인 태그 값
  const [userInfo, setUserInfo] = useState({ name: '', nickname: '', email: '', thumbnail: '' }); // 사용자 정보

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

  // 사용자 정보 불러오기
  useEffect(() => {
    if (currentUser) {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.email === currentUser);
      if (user) {
        setUserInfo({
          name: user.name || '',
          nickname: user.nickname || '',
          email: user.email || '',
          thumbnail: user.thumbnail || ''
        });
      }
    }
  }, [currentUser]);

  // 사용자별 todos 불러오기
  useEffect(() => {
    if (currentUser) {
      const savedTodos = localStorage.getItem(`todos_${currentUser}`);
      if (savedTodos) {
        try {
          setTodos(JSON.parse(savedTodos));
        } catch (e) {
          console.error('Failed to parse todos:', e);
          setTodos([]);
        }
      } else {
        setTodos([]);
      }
    }
  }, [currentUser]);

  // 사용자별 todos 저장
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`todos_${currentUser}`, JSON.stringify(todos));
    }
  }, [todos, currentUser]);

  // 사용자별 태그 색상 불러오기
  useEffect(() => {
    if (currentUser) {
      const savedTagColors = localStorage.getItem(`tagColors_${currentUser}`);
      if (savedTagColors) {
        try {
          setTagColors(JSON.parse(savedTagColors));
        } catch (e) {
          console.error('Failed to parse tagColors:', e);
          setTagColors({});
        }
      } else {
        setTagColors({});
      }
    }
  }, [currentUser]);

  // 사용자별 태그 색상 저장
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`tagColors_${currentUser}`, JSON.stringify(tagColors));
    }
  }, [tagColors, currentUser]);

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
      isFavorite: false,
      dueDate: dueDate ? dueDate.toISOString().split('T')[0] : null,
      tag: tag.trim() || null,
      order: todos.length, // 순서 추가
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

  // 즐겨찾기 토글
  const toggleFavorite = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, isFavorite: !todo.isFavorite } : todo
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
    // 검색 팝업이 열려있으면 먼저 닫기
    if (searchPopupOpen) {
      setSearchPopupOpen(false);
      setSearchKeyword('');
      setSelectedSearchTag('all');
      setSearchResults([]);
      setHasSearched(false);
    }
    // 즐겨찾기 팝업이 열려있으면 먼저 닫기
    if (favoritePopupOpen) {
      closeFavoritePopup();
    }
    
    setEditingTodo(todo);
    setInputValue(todo.text);
    setDueDate(todo.dueDate ? new Date(todo.dueDate) : new Date());
    setTag(todo.tag || '');
  };

  // 투두 수정 저장
  const saveEditTodo = (e) => {
    e.preventDefault();
    if (!editingTodo || inputValue.trim() === '') return;

    setTodos(todos.map(todo =>
      todo.id === editingTodo.id ? { ...todo, text: inputValue.trim(), dueDate: dueDate ? dueDate.toISOString().split('T')[0] : null, tag: tag.trim() || null } : todo
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
      setDueDate(new Date());
      setTag('');
      setIsClosingPopup(false);
    }, 300); // 애니메이션 시간과 동일
  };

  // 메뉴 닫기 (애니메이션 포함)
  const closeMenu = () => {
    setIsClosingMenu(true);
    setTimeout(() => {
      setMenuOpen(false);
      setMenuDetailPage(null);
      setIsClosingMenu(false);
    }, 400); // 애니메이션 시간과 동일
  };

  // 홈 버튼 클릭 (모든 팝업과 메뉴 닫기)
  const handleHomeClick = () => {
    // 메뉴 닫기
    if (menuOpen) {
      closeMenu();
    }
    // 팝업 닫기
    if (addPopupOpen || editingTodo) {
      closePopup();
    }
    // 검색 팝업 닫기
    if (searchPopupOpen) {
      closeSearchPopup();
    }
    // 즐겨찾기 팝업 닫기
    if (favoritePopupOpen) {
      closeFavoritePopup();
    }
    // 삭제 확인 팝업 닫기
    if (deleteConfirmId) {
      closeDeleteConfirm();
    }
    // 컬러 피커 닫기
    if (colorPickerTag) {
      setColorPickerTag(null);
    }
  };

  // 드래그 앤 드롭 종료 핸들러
  const handleDragEnd = (result) => {
    const { source, destination } = result;

    // 드롭 위치가 없거나 같은 위치면 무시
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    // 같은 태그 그룹 내에서만 드래그 가능
    if (source.droppableId !== destination.droppableId) return;

    // 드롭 가능한 영역의 태그명 추출 (droppableId 형식: "tag-tagName" 또는 "tag-untagged")
    const tagName = source.droppableId.replace('tag-', '');
    const isUntagged = tagName === 'untagged';

    // 해당 태그의 todos 필터링 (완료되지 않은 항목만)
    const tagTodos = todos.filter(todo => 
      !todo.completed && 
      (isUntagged ? !todo.tag : todo.tag === tagName)
    );

    // 드래그된 todo 찾기
    const draggedTodo = tagTodos[source.index];
    
    // 전체 todos 배열에서 재정렬
    const allTodos = [...todos];
    const draggedIndex = allTodos.findIndex(t => t.id === draggedTodo.id);
    
    // 같은 태그 그룹 내의 대상 todo 찾기
    const targetTodo = tagTodos[destination.index];
    const targetIndex = allTodos.findIndex(t => t.id === targetTodo.id);

    // 배열 재정렬
    const [removed] = allTodos.splice(draggedIndex, 1);
    allTodos.splice(targetIndex, 0, removed);

    setTodos(allTodos);
  };

  // 할 일 추가 팝업 열기
  const openAddPopup = () => {
    // 메뉴가 열려있으면 먼저 닫기
    if (menuOpen) {
      closeMenu();
    }
    // 검색 팝업이 열려있으면 먼저 닫기
    if (searchPopupOpen) {
      setSearchPopupOpen(false);
      setSearchKeyword('');
      setSelectedSearchTag('all');
      setSearchResults([]);
      setHasSearched(false);
    }
    // 즐겨찾기 팝업이 열려있으면 먼저 닫기
    if (favoritePopupOpen) {
      closeFavoritePopup();
    }
    
    setAddPopupOpen(true);
  };

  // 검색 팝업 열기
  const openSearchPopup = () => {
    // 메뉴가 열려있으면 먼저 닫기
    if (menuOpen) {
      closeMenu();
    }
    // 기존 팝업이 열려있으면 먼저 닫기
    if (addPopupOpen || editingTodo) {
      setAddPopupOpen(false);
      setEditingTodo(null);
      setInputValue('');
      setDueDate(new Date());
      setTag('');
    }
    // 즐겨찾기 팝업이 열려있으면 먼저 닫기
    if (favoritePopupOpen) {
      closeFavoritePopup();
    }
    
    setSearchPopupOpen(true);
    setSearchKeyword('');
    setSelectedSearchTag('all');
    setSearchResults([]);
    setHasSearched(false);
  };

  // 검색 팝업 닫기
  const closeSearchPopup = () => {
    setSearchPopupOpen(false);
    setSearchKeyword('');
    setSelectedSearchTag('all');
    setSearchResults([]);
    setHasSearched(false);
  };

  // 즐겨찾기 팝업 열기
  const openFavoritePopup = () => {
    // 메뉴가 열려있으면 먼저 닫기
    if (menuOpen) {
      closeMenu();
    }
    // 기존 팝업이 열려있으면 먼저 닫기
    if (addPopupOpen || editingTodo) {
      setAddPopupOpen(false);
      setEditingTodo(null);
      setInputValue('');
      setDueDate(new Date());
      setTag('');
    }
    if (searchPopupOpen) {
      closeSearchPopup();
    }
    
    setFavoritePopupOpen(true);
  };

  // 즐겨찾기 팝업 닫기 (애니메이션 포함)
  const closeFavoritePopup = () => {
    setIsClosingFavoritePopup(true);
    setTimeout(() => {
      setFavoritePopupOpen(false);
      setIsClosingFavoritePopup(false);
    }, 300); // 애니메이션 시간과 동일
  };

  // 검색 실행
  const handleSearch = (e) => {
    e.preventDefault();
    setHasSearched(true);

    // 필터링
    let results = todos;

    // 태그 필터
    if (selectedSearchTag !== 'all') {
      if (selectedSearchTag === 'untagged') {
        results = results.filter(todo => !todo.tag);
      } else {
        results = results.filter(todo => todo.tag === selectedSearchTag);
      }
    }

    // 키워드 필터
    if (searchKeyword.trim() !== '') {
      const keyword = searchKeyword.trim().toLowerCase();
      results = results.filter(todo => 
        todo.text.toLowerCase().includes(keyword) ||
        (todo.tag && todo.tag.toLowerCase().includes(keyword))
      );
    }

    setSearchResults(results);
  };

  // 색상 팔레트
  const colorPalette = [
    { name: 'Default', value: 'default', color: '#e0e0e0' },
    { name: 'Gray', value: 'gray', color: '#9e9e9e' },
    { name: 'Brown', value: 'brown', color: '#a1887f' },
    { name: 'Orange', value: 'orange', color: '#ffb74d' },
    { name: 'Yellow', value: 'yellow', color: '#fff176' },
    { name: 'Green', value: 'green', color: '#81c784' },
    { name: 'Blue', value: 'blue', color: '#64b5f6' },
    { name: 'Purple', value: 'purple', color: '#ba68c8' },
    { name: 'Pink', value: 'pink', color: '#f06292' },
    { name: 'Red', value: 'red', color: '#e57373' }
  ];

  // 태그 색상 변경
  const changeTagColor = (tagName, colorValue) => {
    setTagColors(prev => ({
      ...prev,
      [tagName]: colorValue
    }));
    setColorPickerTag(null);
  };

  // 색상 피커 열기
  const openColorPicker = (tagName) => {
    setColorPickerTag(tagName);
  };

  // 색상 피커 닫기
  const closeColorPicker = () => {
    setColorPickerTag(null);
  };

  // 태그 색상 가져오기
  const getTagColor = (tagName) => {
    const colorValue = tagColors[tagName] || 'default';
    const colorInfo = colorPalette.find(c => c.value === colorValue);
    return colorInfo || colorPalette[0];
  };

  // 태그 편집 시작
  const startEditingTag = (tagName) => {
    setEditingTag(tagName);
    setEditingTagValue(tagName);
  };

  // 태그 편집 취소
  const cancelEditingTag = () => {
    setEditingTag(null);
    setEditingTagValue('');
  };

  // 태그 이름 변경 저장
  const saveTagName = (oldTagName) => {
    const newTagName = editingTagValue.trim();
    
    // 빈 값이면 취소
    if (!newTagName) {
      cancelEditingTag();
      return;
    }

    // 같은 이름이면 취소
    if (newTagName === oldTagName) {
      cancelEditingTag();
      return;
    }

    // 이미 존재하는 태그명인지 확인
    if (existingTags.includes(newTagName) && newTagName !== oldTagName) {
      alert('이미 존재하는 태그명입니다.');
      return;
    }

    // 모든 todos에서 태그명 변경
    const updatedTodos = todos.map(todo => 
      todo.tag === oldTagName ? { ...todo, tag: newTagName } : todo
    );
    setTodos(updatedTodos);

    // 태그 색상도 변경
    if (tagColors[oldTagName]) {
      const newTagColors = { ...tagColors };
      newTagColors[newTagName] = newTagColors[oldTagName];
      delete newTagColors[oldTagName];
      setTagColors(newTagColors);
    }

    cancelEditingTag();
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
    // 상태 필터 적용
    if (statusFilter === 'in-progress' && todo.completed) return false;
    if (statusFilter === 'complete' && !todo.completed) return false;

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

  // 각 그룹 내에서 완료 여부에 따라 정렬 (미완료 먼저, 완료 나중)
  const sortByCompletion = (todos) => {
    return [...todos].sort((a, b) => {
      if (a.completed === b.completed) return 0;
      return a.completed ? 1 : -1;
    });
  };

  // 태그가 있는 그룹들과 태그가 없는 그룹을 분리하고 정렬
  const taggedGroups = Object.entries(groupedByTag)
    .filter(([tag]) => tag !== 'null')
    .map(([tag, todos]) => [tag, sortByCompletion(todos)]);
  const untaggedTodos = sortByCompletion(groupedByTag['null'] || []);

  // 즐겨찾기 투두 리스트
  const favoriteTodos = todos.filter(todo => todo.isFavorite);
  
  // 즐겨찾기 투두를 태그별로 그룹화
  const favoriteGroupedByTag = favoriteTodos.reduce((groups, todo) => {
    const tagName = todo.tag || null;
    if (!groups[tagName]) {
      groups[tagName] = [];
    }
    groups[tagName].push(todo);
    return groups;
  }, {});

  const favoriteTaggedGroups = Object.entries(favoriteGroupedByTag)
    .filter(([tag]) => tag !== 'null')
    .map(([tag, todos]) => [tag, todos]);
  const favoriteUntaggedTodos = favoriteGroupedByTag['null'] || [];

  return (
    <div className={`App ${isMobile ? 'mobile' : 'desktop'}`}>

      {/* 상단 헤더 바 */}
      <header className="top-header">
        <h1 className="app-title">
          Todoit
          <img src={logo} alt="Todo Logo" className="app-logo" />
        </h1>
        <button 
          className="menu-btn" 
          onClick={() => {
            if (menuOpen) {
              closeMenu();
            } else {
              setMenuOpen(true);
            }
          }}
          aria-label="메뉴"
        >
          <span className="menu-btn-icon"></span>
        </button>
      </header>
      
      {/* 메뉴 오버레이 */}
      {menuOpen && (
        <div 
          className="menu-overlay" 
          onClick={closeMenu}
        />
      )}

      {/* 사이드 메뉴 */}
      <aside className={`side-menu ${menuOpen ? 'open' : ''} ${isClosingMenu ? 'closing' : ''}`}>
        {/* 메인 메뉴 */}
        {!menuDetailPage && (
          <>
            <div className="side-menu-header">
              <button 
                className="close-menu-btn" 
                onClick={closeMenu}
                aria-label="메뉴 닫기"
              >
                ✕
              </button>
            </div>
            
            {/* 사용자 정보 */}
            <div className="user-info-container">
              <div className="user-thumbnail">
                {userInfo.thumbnail ? (
                  <img src={userInfo.thumbnail} alt={userInfo.nickname} className="user-thumbnail-image" />
                ) : (
                  <div className="user-thumbnail-default">
                    <img src={logo} alt="기본 썸네일" className="user-thumbnail-icon" />
                  </div>
                )}
              </div>
              <div className="user-info-text">
                <p className="user-nickname">{userInfo.nickname || '사용자'}</p>
                <p className="user-email">{userInfo.email}</p>
              </div>
            </div>

            <nav className="side-menu-nav">
              <ul>
                <li onClick={closeMenu}>
                  <span>홈</span>
                </li>
                <li onClick={() => setMenuDetailPage('tags')}>
                  <span>태그 관리</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </li>
                <li onClick={() => setMenuDetailPage('background')}>
                  <span>배경 설정</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </li>
                <li onClick={onLogout} className="logout-item">
                  <span>로그아웃</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                </li>
              </ul>
            </nav>
            <div className="side-menu-footer">
              <p>© mingzzi. All rights reserved.</p>
            </div>
          </>
        )}

        {/* 태그 관리 상세 페이지 */}
        {menuDetailPage === 'tags' && (
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
              <h2>태그 관리</h2>
              <button 
                className="close-menu-btn" 
                onClick={closeMenu}
                aria-label="메뉴 닫기"
              >
                ✕
              </button>
            </div>
            <div className="side-menu-detail">
              <ul className="tag-list">
                {existingTags.length === 0 ? (
                  <li className="empty-tag-message">등록된 태그가 없습니다.</li>
                ) : (
                  existingTags.map((tag) => (
                    <li key={tag} className="tag-item">
                      <div className="tag-item-left">
                        {editingTag === tag ? (
                          <input
                          type="text"
                          className="tag-name-input"
                          value={editingTagValue}
                          onChange={(e) => setEditingTagValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              saveTagName(tag);
                            } else if (e.key === 'Escape') {
                              cancelEditingTag();
                            }
                          }}
                          onBlur={() => saveTagName(tag)}
                          autoFocus
                          />
                        ) : (
                          <>
                          <div 
                            className="tag-color-box"
                            style={{ backgroundColor: getTagColor(tag).color }}
                          />
                          <span className="tag-name">{tag}</span>
                          </>
                        )}
                      </div>
                      <div className="tag-item-right">
                        <span className="tag-count">
                          {todos.filter(todo => todo.tag === tag).length}개
                        </span>
                        <button
                          className="tag-edit-btn"
                          onClick={() => startEditingTag(tag)}
                          aria-label="태그명 수정"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>
                          </svg>
                        </button>
                        <button
                          className="tag-color-btn"
                          onClick={() => openColorPicker(tag)}
                          aria-label="색상 변경"
                        >
                          <span className="tag-color-btn-icon"></span>
                        </button>
                      </div>
                      
                      {/* 색상 선택 팝업 */}
                      {colorPickerTag === tag && (
                        <>
                          <div 
                            className="color-picker-overlay" 
                            onClick={closeColorPicker}
                          />
                          <div className="color-picker-popup">
                            <h4 className="color-picker-title">Colors</h4>
                            <div className="color-picker-grid">
                              {colorPalette.map((colorOption) => (
                                <button
                                  key={colorOption.value}
                                  className={`color-option ${getTagColor(tag).value === colorOption.value ? 'selected' : ''}`}
                                  onClick={() => changeTagColor(tag, colorOption.value)}
                                  title={colorOption.name}
                                >
                                  <div 
                                    className="color-circle"
                                    style={{ backgroundColor: colorOption.color }}
                                  />
                                  <span className="color-name">{colorOption.name}</span>
                                  {getTagColor(tag).value === colorOption.value && (
                                    <svg className="color-check" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                      <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                    </li>
                  ))
                )}
              </ul>
            </div>
            <div className="side-menu-footer">
              <p>© mingzzi. All rights reserved.</p>
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
                onClick={closeMenu}
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
              <p>© mingzzi. All rights reserved.</p>
            </div>
          </>
        )}
      </aside>

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
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className={`cont-todolist ${backgroundType}`}>
            <div className="todolist-header">
              <div className="status-filter">
                <Select
                  className="type_filter"
                  value={statusFilter}
                  onChange={setStatusFilter}
                  options={[
                    { value: 'all', label: 'All' },
                    { value: 'in-progress', label: 'In progress' },
                    { value: 'complete', label: 'Complete' },
                  ]}
                  placeholder="All"
                />
              </div>
            </div>
            {filteredTodos.length === 0 ? (
              <div className="empty-state">
                No data yet :(
              </div>
            ) : (
              <>
                {/* 태그가 있는 항목들 */}
                {taggedGroups.map(([tag, todos]) => {
                  const uncompletedTodos = todos.filter(t => !t.completed);
                  const completedTodos = todos.filter(t => t.completed);
                  
                  return (
                    <div key={tag} className="todo-group">
                      <h3 className="todo-group-tag">
                        <span className="todo-group-tag-txt">
                          <div 
                            className="tag-color-box"
                            style={{ backgroundColor: getTagColor(tag).color }}
                          />
                          <span className="tag-name">
                          {tag}
                          </span>
                        </span>
                      </h3>
                      <Droppable droppableId={`tag-${tag}`}>
                        {(provided) => (
                          <div 
                            className="todo-items-grid"
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                          >
                            {uncompletedTodos.map((todo, index) => (
                              <Draggable key={todo.id} draggableId={todo.id.toString()} index={index}>
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    <TodoItem
                                      todo={todo}
                                      tagColor={todo.tag ? getTagColor(todo.tag).color : null}
                                      onToggle={toggleTodo}
                                      onToggleFavorite={toggleFavorite}
                                      onDelete={openDeleteConfirm}
                                      onEdit={openEditPopup}
                                      isDragging={snapshot.isDragging}
                                    />
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                            {completedTodos.map(todo => (
                              <TodoItem
                                key={todo.id}
                                todo={todo}
                                tagColor={todo.tag ? getTagColor(todo.tag).color : null}
                                onToggle={toggleTodo}
                                onToggleFavorite={toggleFavorite}
                                onDelete={openDeleteConfirm}
                                onEdit={openEditPopup}
                              />
                            ))}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  );
                })}
                
                {/* 태그가 없는 항목들 */}
                {untaggedTodos.length > 0 && (
                  <div className="todo-group">
                    <Droppable droppableId="tag-untagged">
                      {(provided) => {
                        const uncompletedTodos = untaggedTodos.filter(t => !t.completed);
                        const completedTodos = untaggedTodos.filter(t => t.completed);
                        
                        return (
                          <div 
                            className="todo-items-grid"
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                          >
                            {uncompletedTodos.map((todo, index) => (
                              <Draggable key={todo.id} draggableId={todo.id.toString()} index={index}>
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    <TodoItem
                                      todo={todo}
                                      onToggle={toggleTodo}
                                      onToggleFavorite={toggleFavorite}
                                      onDelete={openDeleteConfirm}
                                      onEdit={openEditPopup}
                                      isDragging={snapshot.isDragging}
                                    />
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                            {completedTodos.map(todo => (
                              <TodoItem
                                key={todo.id}
                                todo={todo}
                                onToggle={toggleTodo}
                                onToggleFavorite={toggleFavorite}
                                onDelete={openDeleteConfirm}
                                onEdit={openEditPopup}
                              />
                            ))}
                          </div>
                        );
                      }}
                    </Droppable>
                  </div>
                )}
              </>
            )}
          </div>
        </DragDropContext>
      </div>

      {/* 하단 네비게이션 */}
      <div className="nav">
        <div className="nav-first">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            stroke="currentColor" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            className="feather feather-home" 
            viewBox="0 0 24 24"
            onClick={handleHomeClick}
            style={{ cursor: 'pointer' }}
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path>
          </svg>
          <svg 
            fill="none" 
            stroke="currentColor" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            className="css-i6dzq1" 
            viewBox="0 0 24 24"
            onClick={openSearchPopup}
            style={{ cursor: 'pointer' }}
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="M21 21l-4.35-4.35"></path>
          </svg>
          <svg 
            className="btn-add nav-icon-bold" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 1000 1000"
            onClick={openAddPopup}
          >
            <path fill="currentColor" stroke="currentColor" strokeWidth="15" strokeLinejoin="round" d="M934 822H794v140c0 15.5-12.5 28-28 28s-28-12.5-28-28V822H598c-15.5 0-28-12.5-28-28s12.5-28 28-28h140V626c0-15.5 12.5-28 28-28s28 12.5 28 28v140h140c15.5 0 28 12.5 28 28s-12.5 28-28 28zM738 122c0-30.9-25.1-56-56-56H150c-30.9 0-56 25.1-56 56v756c0 30.9 25.1 56 56 56h364v56H122c-46.4 0-84-37.6-84-84V94c0-46.4 37.6-84 84-84h588c46.4 0 84 37.6 84 84v364h-56V122z"></path>
          </svg>
          <button className="btn-favorite" onClick={openFavoritePopup}>
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
                <DatePicker
                  selected={dueDate}
                  onChange={(date) => setDueDate(date)}
                  dateFormat="yyyy-MM-dd"
                  className="date-input"
                  id="due-date"
                  calendarClassName="custom-calendar"
                  popperClassName="custom-popper"
                  popperPlacement="bottom-start"
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
                  rows={4}
                />
              </div>
              <div className="popup-actions">
                <button 
                  type="button"
                  className="btn-common btn-gray"
                  onClick={closePopup}
                >
                   <span className="popup-btn-text">
                   Cancel
                   </span>
                </button>
                <button type="submit" className="btn-common btn-primary">
                  <span className="popup-btn-text">
                  Save
                  </span>
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

      {/* 검색 팝업 */}
      {searchPopupOpen && (
        <>
          <div 
            className="popup-overlay"
            onClick={closeSearchPopup}
          />
          <div className="bottom-sheet">
            <div className="bottom-sheet-handle"></div>
            <div className="bottom-sheet-header">
              <h2>Search</h2>
              <button 
                className="popup-close-btn"
                onClick={closeSearchPopup}
                aria-label="닫기"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSearch} className="bottom-sheet-content">
              <div className="form-group">
                <label htmlFor="search-tag" className="form-label">Tag</label>
                <Select
                  value={selectedSearchTag}
                  onChange={setSelectedSearchTag}
                  options={[
                    { value: 'all', label: '전체' },
                    ...existingTags.map(tag => ({ value: tag, label: `#${tag}` })),
                    { value: 'untagged', label: '태그 없음' }
                  ]}
                  placeholder="태그를 선택하세요"
                />
              </div>

              <div className="form-group">
                <label htmlFor="search-keyword" className="form-label">Keyword</label>
                <input
                  id="search-keyword"
                  type="text"
                  className="text-input"
                  placeholder="검색어를 입력하세요"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                />
              </div>

              {/* 검색 결과 */}
              {hasSearched && searchResults.length > 0 && (
                <div className="search-results">
                  <h3 className="search-results-title">검색 결과 ({searchResults.length}개)</h3>
                  <div className="search-results-list">
                    {searchResults.map(todo => (
                      <div key={todo.id} className={`search-result-item ${todo.completed ? 'completed' : ''}`}>
                        <div className="search-result-content">
                          <span className="search-result-text">{todo.text}</span>
                          {todo.tag && (
                            <span className="search-result-tag">
                              <div 
                                className="tag-color-box small"
                                style={{ backgroundColor: getTagColor(todo.tag).color }}
                              />
                              {todo.tag}
                            </span>
                          )}
                        </div>
                        {todo.dueDate && (
                          <span className="search-result-date">{formatDate(todo.dueDate)}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {hasSearched && searchResults.length === 0 && (
                <div className="search-no-results">
                  검색 결과가 없습니다.
                </div>
              )}

              <div className="popup-actions">
                <button 
                  type="button"
                  className="btn-common btn-gray"
                  onClick={closeSearchPopup}
                >
                  <span className="popup-btn-text">
                    Cancel
                  </span>
                </button>
                <button 
                  type="submit"
                  className="btn-common btn-primary"
                >
                  <span className="popup-btn-text">
                    Search
                  </span>
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* Favorite 팝업 */}
      {favoritePopupOpen && (
        <>
          <div 
            className={`popup-overlay ${isClosingFavoritePopup ? 'closing' : ''}`}
            onClick={closeFavoritePopup}
          />
          <div className={`bottom-sheet ${isClosingFavoritePopup ? 'closing' : ''}`}>
            <div className="bottom-sheet-handle"></div>
            <div className="bottom-sheet-header">
              <h2>Favorite</h2>
              <button 
                className="popup-close-btn"
                onClick={closeFavoritePopup}
                aria-label="닫기"
              >
                ✕
              </button>
            </div>
            <div className="bottom-sheet-content favorite-list">
              {favoriteTodos.length === 0 ? (
                <div className="empty-state">
                  즐겨찾기한 항목이 없습니다.
                </div>
              ) : (
                <>
                  {/* 태그가 있는 항목들 */}
                  {favoriteTaggedGroups.map(([tag, todos]) => (
                    <div key={tag} className="favorite-group">
                      <h3 className="favorite-group-tag">
                        <span className="favorite-group-tag-txt">
                          <div 
                            className="tag-color-box"
                            style={{ backgroundColor: getTagColor(tag).color }}
                          />
                          <span className="tag-name">
                            {tag}
                          </span>
                        </span>
                      </h3>
                      <div className="favorite-items">
                        {todos.map(todo => (
                          <div key={todo.id} className={`favorite-item ${todo.completed ? 'completed' : ''}`}>
                            <span className="favorite-item-text">{todo.text}</span>
                            {todo.dueDate && (
                              <span className="favorite-item-date">{formatDate(todo.dueDate)}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  {/* 태그가 없는 항목들 */}
                  {favoriteUntaggedTodos.length > 0 && (
                    <div className="favorite-group">
                      <div className="favorite-items">
                        {favoriteUntaggedTodos.map(todo => (
                          <div key={todo.id} className={`favorite-item ${todo.completed ? 'completed' : ''}`}>
                            <span className="favorite-item-text">{todo.text}</span>
                            {todo.dueDate && (
                              <span className="favorite-item-date">{formatDate(todo.dueDate)}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default TodoApp;
