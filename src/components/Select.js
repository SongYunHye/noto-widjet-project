import React, { useState, useRef, useEffect, useCallback } from 'react';

function Select({ value, onChange, options, placeholder = "Select an option", className }) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const selectRef = useRef(null);
  const dropdownRef = useRef(null);
  const itemRefsArray = useRef([]);

  // 선택된 옵션 찾기
  const selectedOption = options.find(opt => opt.value === value);

  // 아이템 선택 핸들러
  const handleSelectOption = useCallback((optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  }, [onChange]);

  // 포커스된 아이템으로 스크롤 이동
  const scrollToItem = useCallback((index) => {
    const itemElement = itemRefsArray.current[index];
    if (itemElement) {
      itemElement.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  }, []);

  // 키보드 네비게이션
  const handleKeyDown = useCallback((e) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(true);
        setFocusedIndex(0);
      }
      return;
    }

    const itemsLength = options.length;
    if (itemsLength === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex((prev) => {
          const newIndex = prev < itemsLength - 1 ? prev + 1 : prev;
          scrollToItem(newIndex);
          return newIndex;
        });
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex((prev) => {
          const newIndex = prev > 0 ? prev - 1 : 0;
          scrollToItem(newIndex);
          return newIndex;
        });
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < itemsLength) {
          handleSelectOption(options[focusedIndex].value);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setFocusedIndex(-1);
        break;
      default:
        break;
    }
  }, [isOpen, focusedIndex, options, handleSelectOption, scrollToItem]);

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // 드롭다운이 열릴 때 선택된 항목으로 스크롤
  useEffect(() => {
    if (isOpen && selectedOption) {
      const selectedIndex = options.findIndex(opt => opt.value === value);
      if (selectedIndex >= 0) {
        setFocusedIndex(selectedIndex);
        scrollToItem(selectedIndex);
      }
    }
  }, [isOpen, selectedOption, value, options, scrollToItem]);

  return (
    <div className="select-wrapper" ref={dropdownRef}>
      <div
        ref={selectRef}
        className={`select-display ${className}`}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={`select-value ${!selectedOption ? 'placeholder' : ''}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg 
          className={`select-arrow ${isOpen ? 'open' : ''}`}
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>
      
      {isOpen && options.length > 0 && (
        <ul className="select-dropdown" role="listbox">
          {options.map((option, index) => (
            <li
              key={option.value}
              ref={(el) => {
                itemRefsArray.current[index] = el;
              }}
              role="option"
              aria-selected={value === option.value}
            >
              <button
                type="button"
                className={`select-option ${focusedIndex === index ? 'focused' : ''} ${value === option.value ? 'selected' : ''}`}
                onClick={() => handleSelectOption(option.value)}
                onMouseEnter={() => setFocusedIndex(index)}
              >
                {option.label}
                {value === option.value && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Select;
