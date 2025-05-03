// /home/ubuntu/colorin_frontend/src/app/admin/coupons/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Define Coupon structure based on backend
interface CouponInfo {
    id: number;
    code: string;
    description: string;
    discount_type: "percentage" | "fixed_amount";
    discount_value: string; // Using string due to Decimal in backend
    valid_from: string;
    valid_until: string;
    max_uses: number;
    current_uses: number;
    is_active: boolean;
    created_at: string;
}

// Placeholder for API call functions (implement with auth)
async function fetchAdminCoupons(): Promise<CouponInfo[]> {
    const token = localStorage.getItem("colorin_token");
    if (!token) throw new Error("Admin token not found");
    try {
        const response = await fetch("/api/coupons/admin", {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (response.status === 401 || response.status === 403) throw new Error("Unauthorized");
        if (!response.ok) throw new Error("Failed to fetch coupons");
        return await response.json();
    } catch (error) { console.error(error); throw error; }
}

async function createAdminCoupon(couponData: any): Promise<CouponInfo> {
    const token = localStorage.getItem("colorin_token");
    if (!token) throw new Error("Admin token not found");
    try {
        const response = await fetch("/api/coupons/admin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(couponData)
        });
        if (response.status === 401 || response.status === 403) throw new Error("Unauthorized");
        const data = await response.json() as CouponInfo;
        if (!response.ok) throw new Error((data as any).error || "Failed to create coupon");
        return data;
    } catch (error) { console.error(error); throw error; }
}

// Helper to format date/time
function formatSimpleDateTime(isoString: string): string {
    try {
        return new Date(isoString).toLocaleString("ko-KR");
    } catch { return "N/A"; }
}

export default function AdminCouponsPage() {
    const router = useRouter();
    const [coupons, setCoupons] = useState<CouponInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showCreateForm, setShowCreateForm] = useState(false);

    // Form state
    const [newCode, setNewCode] = useState("");
    const [newDesc, setNewDesc] = useState("");
    const [newType, setNewType] = useState<"percentage" | "fixed_amount">("fixed_amount");
    const [newValue, setNewValue] = useState("");
    const [newValidFrom, setNewValidFrom] = useState("");
    const [newValidUntil, setNewValidUntil] = useState("");
    const [newMaxUses, setNewMaxUses] = useState("1"); // Default to 1 use
    const [createLoading, setCreateLoading] = useState(false);
    const [createError, setCreateError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        fetchAdminCoupons()
            .then(data => setCoupons(data))
            .catch(err => {
                if (err.message === "Unauthorized") {
                    // Redirect to login or show unauthorized message
                    router.push("/auth/login"); // Redirect to login
                } else {
                    setError(err.message || "쿠폰 목록 로딩 실패");
                }
            })
            .finally(() => setLoading(false));
    }, [router]);

    const handleCreateCoupon = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreateLoading(true);
        setCreateError(null);
        try {
            const couponData = {
                code: newCode,
                description: newDesc,
                discount_type: newType,
                discount_value: newValue,
                valid_from: new Date(newValidFrom).toISOString(),
                valid_until: new Date(newValidUntil).toISOString(),
                max_uses: parseInt(newMaxUses, 10),
                is_active: true, // Default to active
            };
            const createdCoupon = await createAdminCoupon(couponData);
            setCoupons([createdCoupon, ...coupons]); // Add to list
            setShowCreateForm(false); // Hide form
            // Reset form fields
            setNewCode(""); setNewDesc(""); setNewType("fixed_amount"); setNewValue("");
            setNewValidFrom(""); setNewValidUntil(""); setNewMaxUses("1");
        } catch (err: any) {
            setCreateError(err.message || "쿠폰 생성 실패");
        } finally {
            setCreateLoading(false);
        }
    };

    if (loading) return <p className="text-center py-10">관리자 쿠폰 목록 로딩 중...</p>;
    if (error) return <p className="text-center py-10 text-red-500">오류: {error}</p>;

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">쿠폰 관리 (Admin)</h1>
                <button
                    onClick={() => setShowCreateForm(!showCreateForm)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    {showCreateForm ? "취소" : "+ 새 쿠폰 생성"}
                </button>
            </div>

            {/* Create Coupon Form */}
            {showCreateForm && (
                <form onSubmit={handleCreateCoupon} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8 space-y-4">
                    <h2 className="text-xl font-semibold mb-4">새 쿠폰 생성</h2>
                    {createError && <p className="text-red-500 text-sm">{createError}</p>}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="code" className="block text-sm font-medium text-gray-700">쿠폰 코드</label>
                            <input type="text" id="code" value={newCode} onChange={e => setNewCode(e.target.value.toUpperCase())} required className="mt-1 input-field" />
                        </div>
                        <div>
                            <label htmlFor="desc" className="block text-sm font-medium text-gray-700">설명</label>
                            <input type="text" id="desc" value={newDesc} onChange={e => setNewDesc(e.target.value)} required className="mt-1 input-field" />
                        </div>
                        <div>
                            <label htmlFor="type" className="block text-sm font-medium text-gray-700">할인 유형</label>
                            <select id="type" value={newType} onChange={e => setNewType(e.target.value as any)} required className="mt-1 input-field">
                                <option value="fixed_amount">정액 할인</option>
                                <option value="percentage">정률 할인 (%)</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="value" className="block text-sm font-medium text-gray-700">할인 값 ({newType === 'percentage' ? '%' : '원'})</label>
                            <input type="number" id="value" value={newValue} onChange={e => setNewValue(e.target.value)} required min="0" step="any" className="mt-1 input-field" />
                        </div>
                        <div>
                            <label htmlFor="valid_from" className="block text-sm font-medium text-gray-700">유효 시작일</label>
                            <input type="datetime-local" id="valid_from" value={newValidFrom} onChange={e => setNewValidFrom(e.target.value)} required className="mt-1 input-field" />
                        </div>
                        <div>
                            <label htmlFor="valid_until" className="block text-sm font-medium text-gray-700">유효 종료일</label>
                            <input type="datetime-local" id="valid_until" value={newValidUntil} onChange={e => setNewValidUntil(e.target.value)} required className="mt-1 input-field" />
                        </div>
                        <div>
                            <label htmlFor="max_uses" className="block text-sm font-medium text-gray-700">최대 사용 횟수 (전체)</label>
                            <input type="number" id="max_uses" value={newMaxUses} onChange={e => setNewMaxUses(e.target.value)} required min="1" className="mt-1 input-field" />
                        </div>
                    </div>
                    <button type="submit" disabled={createLoading} className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50">
                        {createLoading ? "생성 중..." : "쿠폰 생성"}
                    </button>
                </form>
            )}

            {/* Coupon List Table */}
            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">코드</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">설명</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">할인</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">유효 기간</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">사용/최대</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                            {/* Add Actions column later for edit/deactivate */}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {coupons.map(coupon => (
                            <tr key={coupon.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{coupon.code}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{coupon.description}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {coupon.discount_type === 'percentage' ? `${coupon.discount_value}%` : `${parseInt(coupon.discount_value).toLocaleString()}원`}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatSimpleDateTime(coupon.valid_from)} ~ {formatSimpleDateTime(coupon.valid_until)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{coupon.current_uses} / {coupon.max_uses}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${coupon.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {coupon.is_active ? '활성' : '비활성'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {coupons.length === 0 && <p className="text-center text-gray-500 mt-4">생성된 쿠폰이 없습니다.</p>}
        </div>
    );
}

// Add basic input field styling in globals.css or here if needed
// .input-field { /* styles */ }

