// /home/ubuntu/colorin_frontend/src/app/referral/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface ReferralStatus {
    referral_code: string | null;
    successful_referrals: number;
    target_count: number;
}

// Placeholder for API call functions
async function fetchReferralStatus(): Promise<ReferralStatus> {
    const token = localStorage.getItem("colorin_token");
    if (!token) throw new Error("로그인이 필요합니다.");
    try {
        const response = await fetch("/api/referrals/status", {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (response.status === 401) throw new Error("로그인이 필요합니다.");
        if (!response.ok) throw new Error("추천인 상태를 불러오는데 실패했습니다.");
        return await response.json() as ReferralStatus;
    } catch (error) { console.error(error); throw error; }
}

async function generateReferralCode(): Promise<{ referral_code: string }> {
    const token = localStorage.getItem("colorin_token");
    if (!token) throw new Error("로그인이 필요합니다.");
    try {
        // Assuming GET /my-code generates if not exists
        const response = await fetch("/api/referrals/my-code", {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (response.status === 401) throw new Error("로그인이 필요합니다.");
        if (!response.ok) throw new Error("추천인 코드를 생성/조회하는데 실패했습니다.");
        return await response.json() as { referral_code: string };
    } catch (error) { console.error(error); throw error; }
}

export default function ReferralPage() {
    const router = useRouter();
    const [status, setStatus] = useState<ReferralStatus | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        setLoading(true);
        fetchReferralStatus()
            .then(data => {
                setStatus(data);
                // If code is null, try to generate it
                if (!data.referral_code) {
                    return generateReferralCode();
                }
                return null;
            })
            .then(generated => {
                if (generated) {
                    // Re-fetch status after generation
                    return fetchReferralStatus();
                }
                return status; // Return original status if no generation needed
            })
            .then(finalStatus => {
                 if (finalStatus) setStatus(finalStatus);
            })
            .catch(err => {
                if (err.message === "로그인이 필요합니다.") {
                    router.push("/auth/login");
                } else {
                    setError(err.message || "추천인 정보를 가져오는 중 오류 발생");
                }
            })
            .finally(() => setLoading(false));
    }, [router, status]); // Re-run if status changes (e.g., after code generation)

    const handleCopyCode = () => {
        if (status?.referral_code) {
            navigator.clipboard.writeText(status.referral_code)
                .then(() => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
                })
                .catch(err => {
                    console.error("Failed to copy code:", err);
                    alert("코드 복사에 실패했습니다.");
                });
        }
    };

    if (loading) return <p className="text-center py-10">추천인 정보 로딩 중...</p>;
    if (error) return <p className="text-center py-10 text-red-500">오류: {error}</p>;
    if (!status) return <p className="text-center py-10">추천인 정보를 불러올 수 없습니다.</p>;

    const progressPercent = status.target_count > 0 ? (status.successful_referrals / status.target_count) * 100 : 0;
    const rewardAchieved = status.successful_referrals >= status.target_count;

    return (
        <div className="container mx-auto px-4 py-12 max-w-2xl">
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">친구 초대 프로그램</h1>
            
            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 text-center">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">친구를 초대하고 무료 클래스를 받으세요!</h2>
                <p className="text-gray-600 mb-6">
                    내 추천 코드를 친구에게 공유하세요. 친구 {status.target_count}명이 내 코드를 사용해 첫 클래스를 예약하면,
                    <br />
                    <span className="font-semibold text-pink-600">클래스 1회 무료 쿠폰</span>을 드립니다!
                </p>

                {status.referral_code ? (
                    <div className="mb-6">
                        <p className="text-sm text-gray-500 mb-2">나의 추천 코드:</p>
                        <div className="flex justify-center items-center gap-2">
                            <span className="text-2xl font-bold text-purple-600 bg-purple-50 px-4 py-2 rounded border border-purple-200">
                                {status.referral_code}
                            </span>
                            <button
                                onClick={handleCopyCode}
                                className={`px-4 py-2 rounded text-sm font-medium transition duration-200 ${copied ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                            >
                                {copied ? "복사 완료!" : "코드 복사"}
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-500 mb-6">추천 코드를 생성 중입니다...</p>
                )}

                <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-2">달성 현황:</p>
                    <div className="w-full bg-gray-200 rounded-full h-4 mb-1 overflow-hidden">
                        <div 
                            className="bg-pink-500 h-4 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${Math.min(progressPercent, 100)}%` }}
                        ></div>
                    </div>
                    <p className="text-sm font-medium text-gray-700">
                        {status.successful_referrals} / {status.target_count} 명 초대 완료
                    </p>
                </div>

                {rewardAchieved && (
                    <p className="text-green-600 font-semibold mt-4">
                        🎉 축하합니다! 무료 클래스 쿠폰이 발급되었습니다. 마이페이지 쿠폰함에서 확인하세요.
                    </p>
                )}
            </div>

            {/* How to use section (Optional) */}
            <div className="mt-8 text-left text-sm text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-700 mb-2">참여 방법:</h3>
                <ol className="list-decimal list-inside space-y-1">
                    <li>위의 '코드 복사' 버튼을 눌러 내 추천 코드를 복사합니다.</li>
                    <li>친구에게 코드를 공유합니다.</li>
                    <li>친구가 회원가입 시 또는 첫 클래스 예약 시 추천 코드를 입력합니다.</li>
                    <li>친구 {status.target_count}명이 성공적으로 첫 클래스를 예약/참석하면 추천인에게 무료 쿠폰이 자동 발급됩니다.</li>
                    <li>발급된 쿠폰은 마이페이지 쿠폰함에서 확인할 수 있습니다.</li>
                </ol>
            </div>
        </div>
    );
}

