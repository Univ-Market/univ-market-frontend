import { useState, useEffect, useRef } from 'react';

/**
 * 웹소켓 채팅 기능을 제공하는 커스텀 훅
 *
 * @param {string} roomId - 채팅방 ID
 * @param {string} token - 인증 토큰
 * @returns {Object} 채팅 관련 상태 및 함수
 */
export const useChat = (roomId, token) => {
  // 메시지 목록 상태
  const [messages, setMessages] = useState([]);
  // 연결 상태 (disconnected, connecting, connected, error)
  const [status, setStatus] = useState('disconnected');
  // WebSocket 관련 참조
  const socketRef = useRef(null);
  const stompClientRef = useRef(null);

  // 채팅방 ID나 토큰이 변경될 때 웹소켓 연결 설정
  useEffect(() => {
    if (!roomId || !token) return;

    /**
     * WebSocket 연결 함수
     */
    const connect = () => {
      setStatus('connecting');
      const SockJS = require('sockjs-client');
      const Stomp = require('stompjs');

      // SockJS 및 STOMP 클라이언트 설정
      socketRef.current = new SockJS(`${process.env.REACT_APP_API_URL}/ws`);
      stompClientRef.current = Stomp.over(socketRef.current);

      // 연결 시도
      stompClientRef.current.connect(
        {
          Authorization: `Bearer ${token}`,
        },
        () => {
          // 연결 성공
          setStatus('connected');

          // 채팅방 구독
          stompClientRef.current.subscribe(`/topic/chat/${roomId}`, (message) => {
            const receivedMessage = JSON.parse(message.body);
            setMessages((prev) => [...prev, receivedMessage]);
          });
        },
        (error) => {
          // 연결 실패
          console.error('WebSocket 연결 오류:', error);
          setStatus('error');
          // 5초 후 재연결 시도
          setTimeout(connect, 5000);
        },
      );
    };

    connect();

    // 컴포넌트 언마운트 시 연결 해제
    return () => {
      if (stompClientRef.current && stompClientRef.current.connected) {
        stompClientRef.current.disconnect();
      }
      setStatus('disconnected');
    };
  }, [roomId, token]);

  /**
   * 메시지 전송 함수
   *
   * @param {string} content - 메시지 내용
   * @param {number} senderId - 발신자 ID
   * @returns {boolean} 전송 성공 여부
   */
  const sendMessage = (content, senderId) => {
    if (status !== 'connected') return false;

    stompClientRef.current.send(
      `/app/chat/${roomId}`,
      { Authorization: `Bearer ${token}` },
      JSON.stringify({
        chatRoomId: roomId,
        senderId,
        content,
      }),
    );

    return true;
  };

  return { messages, status, sendMessage };
};
