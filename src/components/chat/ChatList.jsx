import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { formatDate } from '../../utils/format';

/**
 * 채팅방 목록을 표시하는 컴포넌트
 *
 * @param {Object} props - 컴포넌트 props
 * @param {Array} props.chatRooms - 채팅방 목록 배열
 * @param {boolean} props.isLoading - 로딩 상태 여부
 */
const ChatList = ({ chatRooms, isLoading }) => {
  // 현재 URL에서 활성화된 채팅방 ID 추출
  const location = useLocation();
  const currentRoomId = new URLSearchParams(location.search).get('roomId');

  // 로딩 중일 때 표시할 UI
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="inline-block animate-spin rounded-full h-6 w-6 border-4 border-indigo-500 border-t-transparent"></div>
        <p className="ml-2">로딩 중...</p>
      </div>
    );
  }

  // 채팅방이 없을 때 표시할 UI
  if (!chatRooms || chatRooms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-center">
        <p className="text-gray-500 mb-2">진행 중인 채팅이 없습니다.</p>
        <Link to="/products" className="text-indigo-600 hover:underline">
          상품 구경하러 가기
        </Link>
      </div>
    );
  }

  // 채팅방 목록 표시
  return (
    <div className="divide-y">
      {chatRooms.map((room) => (
        <Link
          key={room.id}
          to={`/chat?roomId=${room.id}`}
          className={`block p-4 hover:bg-gray-50 transition ${
            currentRoomId === room.id.toString() ? 'bg-indigo-50' : ''
          }`}
        >
          <div className="flex">
            {/* 상품 이미지 */}
            <div className="flex-shrink-0 mr-3">
              {room.productImageUrl ? (
                <img
                  src={room.productImageUrl}
                  alt={room.productTitle}
                  className="w-12 h-12 rounded-md object-cover"
                />
              ) : (
                <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                  <span className="text-gray-500 text-xs">No Image</span>
                </div>
              )}
            </div>

            {/* 채팅방 정보 */}
            <div className="flex-1 min-w-0">
              {/* 상품명과 최근 메시지 시간 */}
              <div className="flex justify-between items-start">
                <h3 className="text-sm font-medium text-gray-900 truncate">{room.productTitle}</h3>
                <span className="text-xs text-gray-500">
                  {formatDate(room.lastMessage?.createdAt || room.createdAt)}
                </span>
              </div>

              {/* 최근 메시지 내용 */}
              <p className="text-sm text-gray-500 truncate">
                {room.lastMessage ? room.lastMessage.content : '채팅을 시작해보세요'}
              </p>

              {/* 상대방 정보 */}
              <div className="mt-1 flex items-center text-xs text-gray-500">
                <span className="truncate">
                  상대방:{' '}
                  {room.buyerId === room.sellerId ? room.sellerNickname : room.buyerNickname}
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ChatList;
