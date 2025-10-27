import React, { createContext, useState, useCallback } from 'react';

/**
 * 채팅 상태 관리를 위한 Context
 */
export const ChatContext = createContext();

/**
 * 채팅 상태 관리를 위한 Provider 컴포넌트
 * 여러 채팅방의 상태를 관리합니다.
 *
 * @param {Object} props - 컴포넌트 props
 * @param {React.ReactNode} props.children - 자식 컴포넌트
 */
export const ChatProvider = ({ children }) => {
  // 활성화된 채팅방들의 상태 (roomId를 키로 사용)
  const [activeChatRooms, setActiveChatRooms] = useState({});

  /**
   * 채팅방 추가 함수
   *
   * @param {string} roomId - 채팅방 ID
   * @param {Object} roomData - 채팅방 데이터
   */
  const addChatRoom = useCallback((roomId, roomData) => {
    setActiveChatRooms((prev) => ({
      ...prev,
      [roomId]: roomData,
    }));
  }, []);

  /**
   * 채팅방 제거 함수
   *
   * @param {string} roomId - 제거할 채팅방 ID
   */
  const removeChatRoom = useCallback((roomId) => {
    setActiveChatRooms((prev) => {
      const newRooms = { ...prev };
      delete newRooms[roomId];
      return newRooms;
    });
  }, []);

  /**
   * 채팅방에 메시지 추가 함수
   *
   * @param {string} roomId - 채팅방 ID
   * @param {Object} message - 추가할 메시지 데이터
   */
  const addMessageToRoom = useCallback((roomId, message) => {
    setActiveChatRooms((prev) => {
      // 해당 채팅방이 없으면 변경하지 않음
      if (!prev[roomId]) return prev;

      // 메시지 추가
      return {
        ...prev,
        [roomId]: {
          ...prev[roomId],
          messages: [...(prev[roomId].messages || []), message],
        },
      };
    });
  }, []);

  // ChatContext에 제공할 값
  const value = {
    activeChatRooms,
    addChatRoom,
    removeChatRoom,
    addMessageToRoom,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
