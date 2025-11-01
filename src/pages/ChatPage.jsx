import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ChatList from '../components/chat/ChatList';
import ChatRoom from '../components/chat/ChatRoom';
import { getChatRooms, getChatRoomById } from '../services/chatApi';

/**
 * 채팅 페이지 컴포넌트
 * 채팅방 목록과 선택된 채팅방의 메시지를 표시합니다.
 */
const ChatPage = () => {
  // 채팅방 관련 상태
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // URL에서 채팅방 ID 추출
  const location = useLocation();
  const roomId = new URLSearchParams(location.search).get('roomId');

  // 페이지 로딩 시 채팅방 목록 및 선택된 채팅방 정보 가져오기
  useEffect(() => {
    const fetchChatRooms = async () => {
      setIsLoading(true);
      try {
        // 채팅방 목록 API 호출
        const rooms = await getChatRooms();
        setChatRooms(rooms);

        // URL에 roomId가 있으면 선택된 채팅방 정보 가져오기
        if (roomId) {
          const roomDetails = await getChatRoomById(roomId);
          setSelectedRoom(roomDetails);
        }
      } catch (error) {
        console.error('채팅방 목록 불러오기 오류:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChatRooms();
  }, [roomId]);

  /**
   * 채팅방 목록 새로고침 함수
   * 예약이나 거래 완료 등 상태 변경 시 호출됩니다.
   */
  const handleRefreshRooms = async () => {
    try {
      // 채팅방 목록 새로 가져오기
      const rooms = await getChatRooms();
      setChatRooms(rooms);

      // 선택된 채팅방이 있으면 해당 정보도 갱신
      if (roomId) {
        const roomDetails = await getChatRoomById(roomId);
        setSelectedRoom(roomDetails);
      }
    } catch (error) {
      console.error('채팅방 목록 새로고침 오류:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <h1 className="text-2xl font-bold p-6 border-b">채팅</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 h-[600px]">
        {/* 채팅방 목록 (왼쪽 패널) */}
        <div className="md:col-span-1 border-r overflow-y-auto">
          <ChatList chatRooms={chatRooms} isLoading={isLoading} />
        </div>

        {/* 채팅 내용 (오른쪽 패널) */}
        <div className="md:col-span-2">
          <ChatRoom roomId={roomId} chatRoom={selectedRoom} onRefreshRooms={handleRefreshRooms} />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
