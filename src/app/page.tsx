// /home/ubuntu/colorin_frontend/src/app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      {/* 1. Big Banner Section */}
      <section className="bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100 py-20 text-center">
        <div className="container mx-auto px-4">
          {/* Placeholder for dynamic event banner */}
          <h1 className="text-4xl font-bold text-gray-800 mb-4">이번 주말, 특별한 색을 더해보세요!</h1>
          <p className="text-lg text-gray-600 mb-8">가까운 카페에서 즐기는 나만의 아트 클래스</p>
          <Link href="/events/current-main-event" className="bg-pink-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-pink-700 transition duration-300">
            지금 참여하기
          </Link>
        </div>
      </section>

      {/* 2. Service Introduction Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Color in은 어떤 곳인가요?</h2>
          <p className="text-gray-600 max-w-3xl mx-auto mb-12">
            Color in은 카페, 바 등 무료로 임대한 유휴 공간에서 미술, 뜨개질, 도자기, 소개팅 등 다양한 라이트 클래스를 운영하는 로컬 플랫폼입니다. 호스트는 클래스로 수익을, 라운지는 참여자가 주문한 음료/음식으로 매출을, 게스트는 가벼운 경험과 결과물을 얻습니다.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Point 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-xl font-semibold text-pink-600 mb-3">#1 강제성 없는 창의성</h3>
              <p className="text-sm text-gray-600">
                배움이나 퀄리티 중심이 아닌, 가볍게 놀고 대화하며 참여하는 곳입니다. 틀려도 되고, 이상해도 괜찮다는 편안한 분위기를 지향합니다.
              </p>
            </div>
            {/* Point 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-xl font-semibold text-purple-600 mb-3">#2 누구나 가능한 콘텐츠</h3>
              <p className="text-sm text-gray-600">
                초보자도 2시간 안에 ‘그럴싸한’ 결과물을 만들 수 있도록 난이도, 단계, 색감이 철저히 설계되었습니다. “이걸 내가 만들었다고?!” 자기 효능감을 느껴보세요.
              </p>
            </div>
            {/* Point 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-xl font-semibold text-blue-600 mb-3">#3 그림 그리는 술자리</h3>
              <p className="text-sm text-gray-600">
                “술 + 그림”이라는 명확하고 단순한 공식! 진지함 없이 라이트 클래스에서 놀 수 있는 유일한 창의 활동입니다. 그림이 아닌, 감정의 안전한 해방구를 경험하세요.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Class Categories Section (Optional - can link to nav items) */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-10">다양한 클래스를 만나보세요</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Link href="/classes/painting" className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition duration-300 border border-pink-200">
              <span className="text-4xl mb-2 block">🎨</span>
              <h4 className="font-semibold text-pink-700">미술 클래스</h4>
            </Link>
            <Link href="/classes/pottery" className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition duration-300 border border-yellow-200">
              <span className="text-4xl mb-2 block">🏺</span>
              <h4 className="font-semibold text-yellow-700">도자기 클래스</h4>
            </Link>
            <Link href="/classes/knitting" className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition duration-300 border border-green-200">
              <span className="text-4xl mb-2 block">🧶</span>
              <h4 className="font-semibold text-green-700">뜨개질 클래스</h4>
            </Link>
            <Link href="/classes/dating" className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition duration-300 border border-purple-200">
              <span className="text-4xl mb-2 block">💖</span>
              <h4 className="font-semibold text-purple-700">컬러 블렌드 소개팅</h4>
            </Link>
          </div>
        </div>
      </section>

      {/* Add more sections as needed: How it works, Testimonials, Featured Classes etc. */}
    </div>
  );
}

