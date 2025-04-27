"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

// 테마 컨텍스트 타입 정의
type ThemeContextType = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
};

// 테마 컨텍스트 생성
const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  toggleDarkMode: () => {},
});

// 테마 컨텍스트 훅
export const useTheme = () => useContext(ThemeContext);

// ThemeProvider 프롭 타입 정의
interface ThemeProviderProps {
  children: ReactNode;
}

// 테마 제공자 컴포넌트
export default function ThemeProvider({ children }: ThemeProviderProps) {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  // 마운트 시 초기 테마 설정
  useEffect(() => {
    // 로컬 스토리지 확인
    const savedTheme = localStorage.getItem("theme");

    // 시스템 다크모드 설정 확인
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    // 초기 다크모드 상태 설정
    const initialDarkMode = savedTheme
      ? savedTheme === "dark"
      : systemPrefersDark;

    setIsDarkMode(initialDarkMode);

    // body 클래스 설정
    if (initialDarkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }

    // 컴포넌트가 마운트됨을 표시
    setMounted(true);
  }, []);

  // 다크모드 토글 함수
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);

    // body 클래스 업데이트
    if (newDarkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }

    // 로컬 스토리지에 설정 저장
    localStorage.setItem("theme", newDarkMode ? "dark" : "light");
  };

  // 컨텍스트 값
  const value: ThemeContextType = {
    isDarkMode,
    toggleDarkMode,
  };

  // 마운트되기 전에는 아무것도 렌더링하지 않음 (hydration 문제 방지)
  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
