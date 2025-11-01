import React from 'react';

/**
 * 푸터 컴포넌트 - 페이지 하단에 위치하며 저작권 정보 및 링크를 제공합니다.
 */
const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        {/* 푸터 상단 정보 */}
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold mb-2">대학마켓</h3>
            <p>대학생들을 위한 안전한 중고거래 플랫폼</p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-2">고객센터</h4>
            <p>이메일: support@univmarket.com</p>
            <p>운영시간: 평일 10:00 - 18:00</p>
          </div>
        </div>

        {/* 푸터 하단 저작권 및 링크 */}
        <div className="mt-6 border-t border-gray-700 pt-4 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} 대학마켓. All rights reserved.</p>
          <div className="mt-2">
            <a href="/terms" className="mr-4 hover:underline">
              이용약관
            </a>
            <a href="/privacy" className="hover:underline">
              개인정보처리방침
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
