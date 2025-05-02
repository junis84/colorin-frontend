// /home/ubuntu/colorin_frontend/src/components/layout/Footer.tsx
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-600 py-8 mt-12">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* About Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Color in</h3>
          <p className="text-sm mb-2">오늘의 나는, 무슨 색일까?</p>
          <p className="text-sm">가볍게 놀고, 마시고, 웃으며 창작하는 라이트 클래스 플랫폼입니다.</p>
          {/* Add social media links if needed */}
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">바로가기</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="hover:text-pink-600">Color in 소개</Link></li>
            <li><Link href="/classes" className="hover:text-pink-600">전체 클래스 보기</Link></li>
            <li><Link href="/events" className="hover:text-pink-600">이벤트</Link></li>
            <li><Link href="/faq" className="hover:text-pink-600">자주 묻는 질문</Link></li>
            <li><Link href="/contact" className="hover:text-pink-600">문의하기</Link></li>
          </ul>
        </div>

        {/* Legal & Contact */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">고객센터</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/terms" className="hover:text-pink-600">이용약관</Link></li>
            <li><Link href="/privacy" className="hover:text-pink-600">개인정보처리방침</Link></li>
            {/* Add contact info if needed */}
            <li>Email: <a href="mailto:support@colorin.example.com" className="hover:text-pink-600">support@colorin.example.com</a></li>
            <li>Tel: 02-1234-5678</li>
          </ul>
        </div>
      </div>
      <div className="text-center text-xs mt-8 pt-4 border-t border-gray-300">
        &copy; {new Date().getFullYear()} Color in. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

