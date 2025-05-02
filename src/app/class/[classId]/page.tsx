// /home/ubuntu/colorin_frontend/src/app/class/[classId]/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Script from "next/script"; // Import Script component for loading external scripts

// --- Interfaces (keep as defined before) ---
interface ReviewInfo { id: number; rating: number; comment: string | null; created_at: string; author: { id: number; name: string; profile_image_url: string | null; } | null; }
interface HostInfo { id: number; name: string; profile_image_url: string | null; host_introduction: string | null; }
interface ClassDetailInfo { id: number; title: string; description: string; category: string; class_datetime: string; duration_minutes: number; capacity: number; current_participants: number; price: string; location_address: string; location_detail: string | null; location_lat: string | null; location_lng: string | null; status: string; host: HostInfo | null; reviews: ReviewInfo[]; }

// --- API Call Functions (keep as defined before) ---
async function fetchClassDetails(classId: string): Promise<ClassDetailInfo> { /* ... */ }
async function createBooking(classId: number) { /* ... */ }

// --- Helper Functions (keep as defined before) ---
function formatDateTime(isoString: string): string { /* ... */ }

// --- Naver Map Integration ---
const NAVER_MAPS_CLIENT_ID = process.env.NEXT_PUBLIC_NAVER_MAPS_CLIENT_ID || "TEMP_NAVER_CLIENT_ID"; // Use environment variable

export default function ClassDetailPage() {
  const params = useParams();
  const classId = params.classId as string;
  const router = useRouter();
  const [classDetails, setClassDetails] = useState<ClassDetailInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapElement = useRef<HTMLDivElement>(null);

  // Fetch Class Details Effect
  useEffect(() => {
    if (classId) {
      setLoading(true);
      setError(null);
      fetchClassDetails(classId)
        .then(data => {
          setClassDetails(data);
        })
        .catch(err => {
          setError(err.message || "클래스 정보를 가져오는 중 오류 발생");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [classId]);

  // Initialize Naver Map Effect
  useEffect(() => {
    if (mapLoaded && classDetails && classDetails.location_lat && classDetails.location_lng && mapElement.current) {
      const { naver } = window as any; // Access Naver Maps object from window
      if (!naver || !naver.maps) return;

      const mapLatLng = new naver.maps.LatLng(parseFloat(classDetails.location_lat), parseFloat(classDetails.location_lng));

      const mapOptions = {
        center: mapLatLng,
        zoom: 16, // Adjust zoom level as needed
      };

      const map = new naver.maps.Map(mapElement.current, mapOptions);

      new naver.maps.Marker({
        position: mapLatLng,
        map: map,
      });
    }
  }, [mapLoaded, classDetails]); // Re-run when map script is loaded or class details are fetched

  const handleBooking = async () => { /* ... (keep booking logic) */ };

  // --- Render Logic --- 
  if (loading) return <p className="text-center py-10">클래스 정보를 불러오는 중...</p>;
  if (error) return <p className="text-center py-10 text-red-500">오류: {error}</p>;
  if (!classDetails) return <p className="text-center py-10">클래스 정보를 찾을 수 없습니다.</p>;

  const isClassFull = classDetails.current_participants >= classDetails.capacity;
  const isDatingClass = classDetails.category === 'dating';
  const naverMapUrl = `https://map.naver.com/v5/search/${encodeURIComponent(classDetails.location_address)}`;

  return (
    <>
      {/* Load Naver Maps API Script */}
      <Script
        strategy="afterInteractive" // Load after page becomes interactive
        type="text/javascript"
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${NAVER_MAPS_CLIENT_ID}`}
        onReady={() => setMapLoaded(true)} // Set flag when script is loaded
        onError={(e) => {
            console.error("Naver Maps script failed to load:", e);
            setError("지도를 불러오는데 실패했습니다. API 키를 확인해주세요.");
        }}
      />

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Image and Details */}
          <div className="lg:col-span-2">
            {/* ... (Image, Title, Basic Info, Description, Dating Info, Host Info - keep as before) ... */}
             {/* Class Image Placeholder */}
            <div className="w-full h-96 bg-gray-200 rounded-lg mb-6 flex items-center justify-center text-gray-400">
                <span>클래스 대표 이미지</span>
            </div>

            {/* Class Title and Basic Info */}
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{classDetails.title}</h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-gray-600 mb-6">
                <span>📅 {formatDateTime(classDetails.class_datetime)}</span>
                <span>⏳ {classDetails.duration_minutes}분</span>
                <span className="break-all">📍 {classDetails.location_address} {classDetails.location_detail || ""}</span>
                <span>👥 {classDetails.current_participants} / {classDetails.capacity}명</span>
            </div>

            {/* Class Description */}
            <div className="prose max-w-none mb-8">
                <h2 className="text-xl font-semibold mb-3">클래스 소개</h2>
                {/* Use dangerouslySetInnerHTML if description contains HTML, otherwise just render */}
                <p>{classDetails.description}</p>
            </div>

            {/* Special Info for Dating Class */}
            {isDatingClass && (
                <div className="bg-purple-50 p-4 rounded-lg mb-8 border border-purple-200">
                    {/* ... (Dating class info) ... */}
                </div>
            )}

            {/* Host Information */}
            {classDetails.host && (
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-3">호스트 소개</h2>
                    <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                         {/* ... (Host details) ... */}
                    </div>
                </div>
            )}

            {/* Location / Map Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">클래스 장소</h2>
              <a href={naverMapUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline mb-2 block">
                {classDetails.location_address} {classDetails.location_detail || ""} (네이버 지도에서 보기)
              </a>
              {/* Map Container */}
              <div ref={mapElement} className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                {mapLoaded && classDetails.location_lat && classDetails.location_lng ? 
                  "" : // Map will render here
                  "지도 로딩 중... (좌표 정보가 없거나 API 키 오류 시 표시되지 않을 수 있습니다)"
                }
              </div>
            </div>

            {/* Reviews Section */}
            <div>
              <h2 className="text-xl font-semibold mb-3">참여자 리뷰 ({classDetails.reviews.length})</h2>
              {/* ... (Review rendering logic - keep as before) ... */}
            </div>
          </div>

          {/* Right Column: Booking Box */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 bg-white p-6 rounded-lg shadow-md border border-gray-200">
              {/* ... (Booking button and price - keep as before) ... */}
               <h2 className="text-2xl font-bold text-pink-600 mb-4">₩{parseInt(classDetails.price).toLocaleString()}</h2>
                <p className="text-sm text-gray-600 mb-4">친구 2명과 함께 오시면 무료로 참석하실 수 있습니다.</p>

                {bookingError && <p className="text-red-500 text-sm mb-3">{bookingError}</p>}

                <button
                onClick={handleBooking}
                disabled={isClassFull || bookingLoading || classDetails.status !== 'scheduled'}
                className="w-full bg-pink-600 text-white py-3 rounded-md font-semibold hover:bg-pink-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                {bookingLoading ? "예약 처리 중..." : 
                isClassFull ? "정원 마감" : 
                classDetails.status !== 'scheduled' ? `예약 불가 (${classDetails.status})` : 
                "컬러 패스 구매하기"}
                </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// --- Need to update API functions and booking logic for completeness --- 
async function fetchClassDetails(classId: string): Promise<ClassDetailInfo> {
  try {
    const response = await fetch(`/api/classes/${classId}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "클래스 상세 정보를 불러오는데 실패했습니다.");
    }
    const data: ClassDetailInfo = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch class details error:", error);
    throw error;
  }
}

async function createBooking(classId: number) {
    const token = localStorage.getItem("colorin_token");
    if (!token) {
        // Redirect to login or show message
        // Using throw here to be caught in handleBooking
        throw new Error("로그인이 필요합니다.");
    }
    try {
        const response = await fetch(`/api/bookings`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ class_id: classId })
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || "예약 생성에 실패했습니다.");
        }
        return data; // Contains booking details or confirmation
    } catch (error) {
        console.error("Create booking error:", error);
        throw error;
    }
}

