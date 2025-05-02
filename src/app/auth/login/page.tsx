// /home/ubuntu/colorin_frontend/src/app/auth/login/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Placeholder for API call function
async function loginUser(credentials: any) {
  try {
    // Adjust the URL to your backend API endpoint
    const response = await fetch("/api/auth/login", { // Use the new auth blueprint prefix
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "로그인에 실패했습니다.");
    }

    // Handle successful login (store token, redirect)
    if (data.access_token) {
      localStorage.setItem("colorin_token", data.access_token);
    } else {
      throw new Error("로그인 토큰을 받지 못했습니다.");
    }
    return data;
  } catch (error) {
    console.error("Login error:", error);
    throw error; // Re-throw to be caught in the component
  }
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await loginUser({ email, password });
      // Redirect to home page after successful login
      // Need to trigger a state update or reload for Header to reflect login status
      router.push("/");
      // Force reload or use state management to update header
      window.location.href = "/"; // Simple reload for now
    } catch (err: any) {
      setError(err.message || "로그인 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleKakaoLogin = () => {
    // Redirect to backend Kakao login endpoint
    window.location.href = "/api/auth/login/kakao"; // Adjust if needed
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-md">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">로그인</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-8 rounded-lg shadow-md">
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">이메일</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">비밀번호</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
          />
        </div>

        {/* Add forgot password link if needed */}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50"
        >
          {loading ? "로그인 중..." : "로그인"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          계정이 없으신가요?{" "}
          <Link href="/auth/signup" className="font-medium text-pink-600 hover:text-pink-500">
            회원가입
          </Link>
        </p>
      </div>

      {/* Social Login Buttons */}
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">또는 소셜 계정으로 로그인</span>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-3">
          {/* Kakao Login Button */}
          <button
            onClick={handleKakaoLogin}
            className="w-full inline-flex justify-center py-2 px-4 border border-yellow-300 rounded-md shadow-sm bg-yellow-300 text-sm font-medium text-black hover:bg-yellow-400"
          >
            {/* Add Kakao logo/icon here */}
            카카오 로그인
          </button>
          {/* Add Naver, Facebook, Apple buttons - link to respective backend endpoints */}
          {/* Example: <button onClick={() => window.location.href=\"/api/auth/login/naver\"} ...>네이버 로그인</button> */}
        </div>
      </div>
    </div>
  );
}

