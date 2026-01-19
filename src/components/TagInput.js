import React, { useState, useRef, useEffect, useCallback } from 'react';

function TagInput({ value, onChange, existingTags, placeholder = "Enter or select a tag" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const itemRefsArray = useRef([]);

  // 검색 필터링
  const filteredTags = existingTags.filter(tag => 
    tag.toLowerCase().includes(value.toLowerCase())
  );

  // 아이템 선택 핸들러
  const handleSelectTag = useCallback((tag) => {
    onChange(tag);
    setIsOpen(false);
    inputRef.current?.focus();
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
      if (e.key === 'ArrowDown' && filteredTags.length > 0) {
        e.preventDefault();
        setIsOpen(true);
        setFocusedIndex(0);
      }
      return;
    }

    const itemsLength = filteredTags.length;
    if (itemsLength === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex((prev) => {
          const nextIndex = prev + 1 >= itemsLength ? 0 : prev + 1;
          scrollToItem(nextIndex);
          return nextIndex;
        });
        break;

      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex((prev) => {
          const nextIndex = prev - 1 < 0 ? itemsLength - 1 : prev - 1;
          scrollToItem(nextIndex);
          return nextIndex;
        });
        break;

      case 'Enter':
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < itemsLength) {
          handleSelectTag(filteredTags[focusedIndex]);
        } else {
          // 포커스된 항목이 없으면 드롭다운만 닫기
          setIsOpen(false);
        }
        break;

      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;

      default:
        break;
    }
  }, [isOpen, filteredTags, focusedIndex, handleSelectTag, scrollToItem]);

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

  // 드롭다운이 닫힐 때 초기화
  useEffect(() => {
    if (!isOpen) {
      setFocusedIndex(-1);
    }
  }, [isOpen]);

  return (
    <div className="tag-input-wrapper" ref={dropdownRef}>
      <input
        ref={inputRef}
        id="todo-tag"
        type="text"
        className="tag-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => {
          if (filteredTags.length > 0) {
            setIsOpen(true);
          }
        }}
        onKeyDown={handleKeyDown}
      />
      
      {isOpen && filteredTags.length > 0 && (
        <ul className="tag-suggestions-dropdown">
          {filteredTags.map((tag, index) => (
            <li
              key={tag}
              ref={(el) => {
                itemRefsArray.current[index] = el;
              }}
            >
              <button
                type="button"
                className={`tag-suggestion-item ${focusedIndex === index ? 'focused' : ''}`}
                onClick={() => handleSelectTag(tag)}
                onMouseEnter={() => setFocusedIndex(index)}
              >
                #{tag}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TagInput;
