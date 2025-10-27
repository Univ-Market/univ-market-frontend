import React from 'react';
import { formatTime } from '../../utils/format';

/**
 * 개별 채팅 메시지를 표시하는 컴포넌트
 *
 * @param {Object} props - 컴포넌트 props
 * @param {Object} props.message - 메시지 정보
 * @param {boolean} props.isMine - 현재 사용자의 메시지인지 여부
 * @param {Object} props.prevMessage - 이전 메시지 정보 (연속된 메시지 표시를 위해 사용)
 */
const ChatMessage = ({ message, isMine, prevMessage }) => {
  // 시스템 메시지인지 확인 (예약, 거래완료 알림 등)
  const isSystemMessage = message.content.startsWith('🔔') || message.content.startsWith('✅');

  // 같은 사람이 연속해서 보낸 메시지인지 확인 (1분 이내)
  const isContinuous =
    prevMessage &&
    prevMessage.senderId === message.senderId &&
    new Date(message.createdAt) - new Date(prevMessage.createdAt) < 60000;

  // 시스템 메시지일 경우 중앙 정렬된 알림 형태로 표시
  if (isSystemMessage) {
    return (
      <div className="flex justify-center my-2">
        <div className="inline-block px-4 py-2 bg-gray-200 rounded-full text-sm text-gray-700">
          {message.content}
        </div>
      </div>
    );
  }

  // 일반 메시지 표시
  return (
    <div
      className={`flex ${isMine ? 'justify-end' : 'justify-start'} ${
        isContinuous ? 'mt-1' : 'mt-4'
      }`}
    >
      <div className={`max-w-xs md:max-w-md ${isMine ? 'order-1' : 'order-2'}`}>
        {/* 연속되지 않은 메시지일 경우에만 발신자 이름 표시 */}
        {!isContinuous && !isMine && (
          <div className="text-sm text-gray-500 mb-1 ml-1">{message.senderNickname}</div>
        )}

        <div className="flex items-end">
          {/* 타인의 메시지일 경우 프로필 아이콘 표시 */}
          {!isMine && (
            <div className="flex-shrink-0 mr-2">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white">
                {message.senderNickname?.charAt(0)}
              </div>
            </div>
          )}

          {/* 메시지 내용 */}
          <div
            className={`px-4 py-2 rounded-lg ${
              isMine
                ? 'bg-indigo-600 text-white rounded-br-none' // 내 메시지 스타일
                : 'bg-white border rounded-bl-none' // 타인 메시지 스타일
            }`}
          >
            <p className="whitespace-pre-wrap break-words">{message.content}</p>
          </div>

          {/* 메시지 시간 */}
          <div className="text-xs text-gray-500 ml-2">{formatTime(message.createdAt)}</div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
