// /home/ubuntu/colorin_frontend/src/app/classes/[category]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

// Define the structure of a Class object based on backend to_dict
interface ClassInfo {
  id: number;
  title: string;
  description: string;
  category: string;
  class_datetime: string;
  duration_minutes: number;
  capacity: number;
  current_participants: number;
  price: string;
  location_address: string;
  location_detail: string | null;
  host: {
    id: number;
    name: string;
    profile_image_url: string | null;
    host_introduction: string | null;
  } | null; // Host info might be included
  // Add other fields as needed
}

// Placeholder for API call function
async function fetchClasses(category: string): Promise<ClassInfo[]> {
  try {
    // Adjust the URL to your backend API endpoint
    const response = await fetch(`/api/classes?category=${category}&status=scheduled`); // Fetch scheduled classes for the category
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "클래스 목록을 불러오는데 실패했습니다.");
    }
    const data: ClassInfo[] = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch classes error:", error);
    throw error; // Re-throw to be caught in the component
  }
}

// Helper function to format date/time
function formatDateTime(isoString: string): string {
    try {
        const date = new Date(isoString);
        // Example format: 5월 3일 (토) 오후 7:00
        return date.toLocaleString("ko-KR", {
            month: "long",
            day: "numeric",
            weekday: "short",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
        });
    } catch (e) {
        return "날짜 정보 없음";
    }
}

export default function ClassListPage() {
  const params = useParams();
  const category = params.category as string;
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (category) {
      setLoading(true);
      setError(null);
      fetchClasses(category)
        .then(data => {
          setClasses(data);
        })
        .catch(err => {
          setError(err.message || "클래스 정보를 가져오는 중 오류 발생");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [category]); // Re-fetch when category changes

  // Map category slugs to display names
  const categoryDisplayNames: { [key: string]: string } = {
      painting: "미술 클래스",
      pottery: "도자기 클래스",
      knitting: "뜨개질 클래스",
      dating: "컬러 블렌드 소개팅",
      all: "전체 클래스" // If you have an /classes/all route
  };

  const categoryName = categoryDisplayNames[category] || category; // Fallback to slug if not found

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">{categoryName} 목록</h1>

      {/* TODO: Add Filtering Options (Date, Location etc.) */}
      {/* <div className="mb-8 p-4 bg-gray-100 rounded-md">
        <p>필터링 옵션 영역 (날짜, 지역 등)</p>
      </div> */}

      {loading && <p className="text-center text-gray-500">클래스 목록을 불러오는 중...</p>}
      {error && <p className="text-center text-red-500">오류: {error}</p>}

      {!loading && !error && classes.length === 0 && (
        <p className="text-center text-gray-500">예정된 {categoryName}가 없습니다.</p>
      )}

      {!loading && !error && classes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((cls) => (
            <Link key={cls.id} href={`/class/${cls.id}`} className="block border border-gray-200 rounded-lg overflow-hidden shadow hover:shadow-lg transition duration-300 bg-white">
              {/* Placeholder for Class Image */}
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400">
                {/* Replace with <Image /> component later */}
                <span>클래스 이미지</span>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">{cls.title}</h3>
                <p className="text-sm text-gray-500 mb-1">📅 {formatDateTime(cls.class_datetime)}</p>
                <p className="text-sm text-gray-500 mb-1">📍 {cls.location_address} {cls.location_detail || ""}</p>
                {cls.host && (
                    <p className="text-sm text-gray-500 mb-2">👤 호스트: {cls.host.name}</p>
                )}
                <div className="flex justify-between items-center mt-3">
                    <span className="text-lg font-bold text-pink-600">₩{parseInt(cls.price).toLocaleString()}</span>
                    <span className="text-sm text-gray-500">정원: {cls.current_participants}/{cls.capacity}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

