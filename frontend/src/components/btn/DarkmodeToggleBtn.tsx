"use client";

import { useEffect, useState } from "react";

export default function DarkmodeToggleBtn() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  // 초기 다크모드 상태 확인 (로컬 스토리지 또는 시스템 설정 기반)
  useEffect(() => {
    // 컴포넌트가 마운트되었음을 표시
    setMounted(true);

    // 로컬 스토리지에서 테마 설정 확인
    const savedTheme = localStorage.getItem("theme");

    // 시스템 다크모드 설정 확인
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    // 로컬 스토리지에 저장된 테마가 있으면 그 설정 사용, 없으면 시스템 설정 따름
    const initialDarkMode = savedTheme
      ? savedTheme === "dark"
      : systemPrefersDark;

    setIsDarkMode(initialDarkMode);

    // 초기 상태에 따라 body 클래스 설정
    if (initialDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
      // 라이트 모드가 명시적으로 선택된 경우 시스템 다크모드 설정 무시
      if (savedTheme === "light") {
        document.documentElement.classList.add("light");
      }
    }
  }, []);

  // 다크모드 상태 토글 함수
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);

    // html 클래스 업데이트 (css 변수용)
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    }

    // 로컬 스토리지에 설정 저장
    localStorage.setItem("theme", newDarkMode ? "dark" : "light");
  };

  // 마운트되기 전에는 아무것도 렌더링하지 않음 (hydration 문제 방지)
  if (!mounted) {
    return null;
  }

  return (
    <button
      onClick={toggleDarkMode}
      className="flex items-center justify-center w-8 h-8 rounded-full focus:outline-none"
      aria-label={isDarkMode ? "라이트 모드로 전환" : "다크 모드로 전환"}
    >
      {isDarkMode ? (
        // 라이트 모드로 전환하는 버튼 (현재 다크모드일 때 보이는 아이콘)
        <svg
          className="cursor-pointer"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#b9cc10"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
      ) : (
        // 다크 모드로 전환하는 버튼 (현재 라이트모드일 때 보이는 아이콘)
        <svg
          className="cursor-pointer"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="gray"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      )}
    </button>
  );
}
