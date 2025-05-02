// /home/ubuntu/colorin_frontend/src/components/layout/Header.tsx
"use client"; // Indicate this is a Client Component for potential state/hooks

import Link from "next/link";
import { useState, useEffect } from "react";

// Placeholder for authentication status - replace with actual auth context/hook
const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    // Check for token in localStorage or context
    const token = localStorage.getItem("colorin_token");
    if (token) {
      setIsLoggedIn(true);
      // Fetch user profile or get name from token payload if stored
      // For now, just set a placeholder name
      setUserName("사용자"); // Replace with actual user name
    } else {
      setIsLoggedIn(false);
      setUserName(null);
    }
  }, []); // Run once on mount

  const logout = () => {
    localStorage.removeItem("colorin_token");
    setIsLoggedIn(false);
    setUserName(null);
    // Optionally redirect to home page
    window.location.href = "/";
  };

  return { isLoggedIn, userName, logout };
};

const Header = () => {
  const { isLoggedIn, userName, logout } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo and Brand Slogan */}
        <Link href="/" className="text-2xl font-bold text-pink-600">
          Color in
          <span className="block text-xs font-normal text-gray-500">오늘의 나는, 무슨 색일까?</span>
        </Link>

        {/* Navigation Links */}
        <ul className="hidden md:flex space-x-6 items-center">
          <li><Link href="/events" className="text-gray-700 hover:text-pink-600">이벤트</Link></li>
          <li><Link href="/classes/painting" className="text-gray-700 hover:text-pink-600">미술 클래스</Link></li>
          <li><Link href="/classes/pottery" className="text-gray-700 hover:text-pink-600">도자기 클래스</Link></li>
          <li><Link href="/classes/knitting" className="text-gray-700 hover:text-pink-600">뜨개질 클래스</Link></li>
          <li><Link href="/classes/dating" className="text-gray-700 hover:text-pink-600">컬러 블렌드 소개팅</Link></li>
          {/* Add 'Events Near Me' link later when the feature is built */}
          <li><Link href="/nearby" className="text-gray-700 hover:text-pink-600">내 근처 클래스</Link></li>
        </ul>

        {/* Auth Links */}
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              <span className="text-gray-700">안녕하세요, {userName}님!</span>
              <Link href="/mypage" className="text-gray-700 hover:text-pink-600">마이페이지</Link>
              <button onClick={logout} className="bg-pink-500 text-white px-3 py-1 rounded hover:bg-pink-600 text-sm">
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-gray-700 hover:text-pink-600">로그인</Link>
              <Link href="/auth/signup" className="bg-pink-500 text-white px-3 py-1 rounded hover:bg-pink-600 text-sm">
                회원가입
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button (Placeholder) */}
        <div className="md:hidden">
          <button className="text-gray-700 focus:outline-none">
            {/* Add hamburger icon here */}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
          </button>
        </div>
      </nav>
      {/* Mobile Menu Panel (Placeholder) */}
      {/* Add logic to toggle mobile menu visibility */}
    </header>
  );
};

export default Header;

