// /home/ubuntu/colorin_frontend/src/app/auth/signup/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Use next/navigation for App Router

// Placeholder for API call function
async function registerUser(userData: any) {
  try {
    // Adjust the URL to your backend API endpoint
    const response = await fetch("/api/users/register", { // Assuming proxy is set up or using full URL
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "회원가입에 실패했습니다.");
    }

    // Handle successful registration (e.g., store token, redirect)
    if (data.access_token) {
      localStorage.setItem("colorin_token", data.access_token);
    }
    return data;
  } catch (error) {
    console.error("Registration error:", error);
    throw error; // Re-throw to be caught in the component
  }
}

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState("guest"); // Default to guest
  const [hostIntroduction, setHostIntroduction] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (password.length < 6) { // Basic password length validation
        setError("비밀번호는 6자 이상이어야 합니다.");
        return;
    }
    if (userType === "host" && !hostIntroduction) {
        setError("호스트 소개를 입력해주세요.");
        return;
    }

    setLoading(true);
    try {
      const userData = {
        name,
        email,
        password,
        user_type: userType,
        host_introduction: userType === "host" ? hostIntroduction : undefined,
      };
      await registerUser(userData);
      // Redirect to home or login page after successful registration
      router.push("/"); // Redirect to home page
    } catch (err: any) { // Catch specific error type if possible
      setError(err.message || "회원가입 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-md">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">회원가입</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-8 rounded-lg shadow-md">
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">이름</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
          />
        </div>

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
            minLength={6}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">비밀번호 확인</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">가입 유형</label>
          <select
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
          >
            <option value="guest">참여자 (Guest)</option>
            <option value="host">호스트 (Host)</option>
            {/* Admin registration might be handled differently */}
          </select>
        </div>

        {userType === "host" && (
          <div>
            <label htmlFor="hostIntroduction" className="block text-sm font-medium text-gray-700">호스트 소개</label>
            <textarea
              id="hostIntroduction"
              value={hostIntroduction}
              onChange={(e) => setHostIntroduction(e.target.value)}
              rows={3}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
              placeholder="간단한 자기소개, 경력, 클래스 스타일 등을 입력해주세요."
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50"
        >
          {loading ? "가입하는 중..." : "가입하기"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          이미 계정이 있으신가요?{" "}
          <Link href="/auth/login" className="font-medium text-pink-600 hover:text-pink-500">
            로그인
          </Link>
        </p>
      </div>

      {/* Social Login Buttons - Add later */}
      {/* <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">또는 소셜 계정으로 가입</span>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-3">
          <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
            카카오
          </button>
           Add Naver, Facebook, Apple buttons
        </div>
      </div> */}
    </div>
  );
}

