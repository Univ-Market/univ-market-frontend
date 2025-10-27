import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { formatDate } from '../../utils/format';
import { getChatMessages, sendChatMessage } from '../../services/chatApi';
import { reserveProduct, completeTransaction } from '../../services/productApi';
import ChatMessage from './ChatMessage';

/**
 * 채팅방 컴포넌트
 * 실시간 메시지 송수신 및 거래 관련 기능을 제공합니다.
 *
 * @param {Object} props - 컴포넌트 props
 * @param {string} props.roomId - 채팅방 ID
 * @param {Object} props.chatRoom - 채팅방 정보
 * @param {Function} props.onRefreshRooms - 채팅방 목록 새로고침 함수
 */
const ChatRoom = ({ roomId, chatRoom, onRefreshRooms }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  // 메시지 관련 상태
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  // 로딩 및 에러 상태
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  // 거래 상태 관련
  const [isReserving, setIsReserving] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  // DOM 참조
  const messagesEndRef = useRef(null);
  const messageAreaRef = useRef(null);
  // WebSocket 클라이언트 참조
  const stompClientRef = useRef(null);

  /**
   * 채팅 메시지 로드 함수
   * 채팅방 ID가 있을 경우 메시지 목록을 가져옵니다.
   */
  useEffect(() => {
    const fetchMessages = async () => {
      if (!roomId) return;

      setIsLoading(true);
      setError('');

      try {
        // 메시지 목록 가져오기 API 호출
        const data = await getChatMessages(roomId);
        setMessages(data);
      } catch (err) {
        console.error('메시지 로딩 오류:', err);
        setError('메시지를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [roomId]);

  /**
   * WebSocket 연결 설정
   * 실시간 메시지 수신을 위한 WebSocket 연결을 설정합니다.
   */
  useEffect(() => {
    if (!roomId || !user) return;

    const connectWebSocket = () => {
      const SockJS = require('sockjs-client');
      const Stomp = require('stompjs');

      // WebSocket 연결 생성
      const socket = new SockJS(`${process.env.REACT_APP_API_URL}/ws`);
      const client = Stomp.over(socket);

      // WebSocket 연결 설정
      client.connect(
        {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        () => {
          // 채팅방 구독 (메시지 수신 시 처리)
          client.subscribe(`/topic/chat/${roomId}`, (message) => {
            const receivedMessage = JSON.parse(message.body);
            setMessages((prev) => [...prev, receivedMessage]);
          });
        },
        (error) => {
          console.error('WebSocket 연결 오류:', error);
          setTimeout(connectWebSocket, 5000); // 5초 후 재연결 시도
        },
      );

      stompClientRef.current = client;
    };

    connectWebSocket();

    // 컴포넌트 언마운트 시 WebSocket 연결 해제
    return () => {
      if (stompClientRef.current && stompClientRef.current.connected) {
        stompClientRef.current.disconnect();
      }
    };
  }, [roomId, user]);

  /**
   * 새 메시지가 추가될 때마다 스크롤을 맨 아래로 이동
   */
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  /**
   * 메시지 전송 처리 함수
   */
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    try {
      if (stompClientRef.current && stompClientRef.current.connected) {
        // WebSocket을 통한 메시지 전송
        stompClientRef.current.send(
          `/app/chat/${roomId}`,
          { Authorization: `Bearer ${localStorage.getItem('token')}` },
          JSON.stringify({
            chatRoomId: roomId,
            senderId: user.id,
            content: message.trim(),
          }),
        );
      } else {
        // WebSocket 연결이 없는 경우 REST API로 전송
        await sendChatMessage(roomId, message.trim());
        // 메시지 목록 갱신
        const updatedMessages = await getChatMessages(roomId);
        setMessages(updatedMessages);
      }

      // 입력창 초기화
      setMessage('');

      // 채팅방 목록 갱신 (최근 메시지 정보 업데이트)
      if (onRefreshRooms) {
        onRefreshRooms();
      }
    } catch (err) {
      console.error('메시지 전송 오류:', err);
      alert('메시지를 전송할 수 없습니다. 다시 시도해주세요.');
    }
  };

  /**
   * 상품 예약 처리 함수
   */
  const handleReserveProduct = async () => {
    if (!chatRoom) return;

    // 사용자 확인
    if (!window.confirm('이 상품을 예약하시겠습니까?')) {
      return;
    }

    setIsReserving(true);
    try {
      // 예약 API 호출
      await reserveProduct(chatRoom.productId);

      // 예약 성공 메시지 전송
      if (stompClientRef.current && stompClientRef.current.connected) {
        stompClientRef.current.send(
          `/app/chat/${roomId}`,
          { Authorization: `Bearer ${localStorage.getItem('token')}` },
          JSON.stringify({
            chatRoomId: roomId,
            senderId: user.id,
            content: '🔔 상품이 예약되었습니다.',
          }),
        );
      }

      alert('상품이 예약되었습니다.');

      // 채팅방 정보 갱신
      if (onRefreshRooms) {
        onRefreshRooms();
      }
    } catch (err) {
      console.error('상품 예약 오류:', err);
      alert('상품을 예약할 수 없습니다. 다시 시도해주세요.');
    } finally {
      setIsReserving(false);
    }
  };

  /**
   * 거래 완료 처리 함수
   */
  const handleCompleteTransaction = async () => {
    if (!chatRoom) return;

    // 사용자 확인
    if (!window.confirm('거래를 완료하시겠습니까?')) {
      return;
    }

    setIsCompleting(true);
    try {
      // 거래 완료 API 호출
      await completeTransaction(chatRoom.productId);

      // 거래 완료 메시지 전송
      if (stompClientRef.current && stompClientRef.current.connected) {
        stompClientRef.current.send(
          `/app/chat/${roomId}`,
          { Authorization: `Bearer ${localStorage.getItem('token')}` },
          JSON.stringify({
            chatRoomId: roomId,
            senderId: user.id,
            content: '✅ 거래가 완료되었습니다.',
          }),
        );
      }

      alert('거래가 완료되었습니다.');

      // 채팅방 정보 갱신
      if (onRefreshRooms) {
        onRefreshRooms();
      }
    } catch (err) {
      console.error('거래 완료 오류:', err);
      alert('거래를 완료할 수 없습니다. 다시 시도해주세요.');
    } finally {
      setIsCompleting(false);
    }
  };

  /**
   * 상품 상세 페이지로 이동하는 함수
   */
  const goToProductDetail = () => {
    if (!chatRoom) return;
    navigate(`/products/${chatRoom.productId}`);
  };

  // 채팅방 ID가 없을 경우 안내 메시지 표시
  if (!roomId) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-1">채팅방을 선택해주세요</h3>
          <p className="text-gray-500">왼쪽 목록에서 대화할 채팅방을 선택하세요.</p>
        </div>
      </div>
    );
  }

  // 로딩 중일 때 표시할 UI
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
        <p className="ml-2">채팅방을 불러오는 중...</p>
      </div>
    );
  }

  // 에러가 있을 때 표시할 UI
  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-2">{error}</p>
          <button
            onClick={() => navigate('/chat')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            채팅방 목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  // 채팅방 정보가 없을 때 표시할 UI
  if (!chatRoom) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-2">채팅방 정보를 찾을 수 없습니다.</p>
          <button
            onClick={() => navigate('/chat')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            채팅방 목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  // 현재 사용자가 판매자인지 확인
  const isSeller = user.id === chatRoom.sellerId;
  // 현재 상품 상태 확인
  const productStatus = chatRoom.productStatus || 'WAITING';

  return (
    <div className="flex flex-col h-full">
      {/* 채팅방 헤더 */}
      <div className="flex items-center p-4 border-b bg-white">
        <div className="flex-shrink-0 mr-3">
          {/* 상품 이미지 */}
          {chatRoom.productImageUrl ? (
            <img
              src={chatRoom.productImageUrl}
              alt={chatRoom.productTitle}
              className="w-12 h-12 rounded-md object-cover cursor-pointer"
              onClick={goToProductDetail}
            />
          ) : (
            <div
              className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center cursor-pointer"
              onClick={goToProductDetail}
            >
              <span className="text-gray-500 text-xs">No Image</span>
            </div>
          )}
        </div>

        {/* 상품 정보 */}
        <div className="flex-1">
          <h3
            className="font-medium text-gray-900 cursor-pointer hover:underline"
            onClick={goToProductDetail}
          >
            {chatRoom.productTitle}
          </h3>
          <div className="flex items-center">
            {/* 상품 상태 배지 */}
            <span
              className={`px-2 py-1 text-xs rounded-full ${
                productStatus === 'WAITING'
                  ? 'bg-green-100 text-green-800'
                  : productStatus === 'RESERVED'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {productStatus === 'WAITING'
                ? '판매중'
                : productStatus === 'RESERVED'
                ? '예약중'
                : '판매완료'}
            </span>
            <span className="mx-2 text-gray-400">•</span>
            {/* 상대방 정보 */}
            <span className="text-sm text-gray-500">
              {isSeller ? '구매자' : '판매자'}:{' '}
              {isSeller ? chatRoom.buyerNickname : chatRoom.sellerNickname}
            </span>
          </div>
        </div>

        {/* 상품 상태에 따른 액션 버튼 */}
        {productStatus !== 'COMPLETED' && (
          <div>
            {/* 판매중 상태이고 구매자일 경우 예약 버튼 표시 */}
            {productStatus === 'WAITING' && !isSeller && (
              <button
                onClick={handleReserveProduct}
                disabled={isReserving}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:bg-green-300"
              >
                {isReserving ? '처리중...' : '예약하기'}
              </button>
            )}

            {/* 예약중 상태이고 판매자일 경우 거래완료 버튼 표시 */}
            {productStatus === 'RESERVED' &&
              (isSeller ? (
                <button
                  onClick={handleCompleteTransaction}
                  disabled={isCompleting}
                  className="px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 disabled:bg-indigo-300"
                >
                  {isCompleting ? '처리중...' : '거래완료'}
                </button>
              ) : null)}
          </div>
        )}
      </div>

      {/* 채팅 메시지 영역 */}
      <div ref={messageAreaRef} className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {/* 메시지가 없을 경우 안내 메시지 */}
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <p className="text-gray-500">아직 메시지가 없습니다.</p>
              <p className="text-gray-500 text-sm mt-1">첫 메시지를 보내보세요!</p>
            </div>
          </div>
        ) : (
          // 메시지 목록 표시
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <ChatMessage
                key={msg.id || index}
                message={msg}
                isMine={msg.senderId === user.id}
                prevMessage={index > 0 ? messages[index - 1] : null}
              />
            ))}
            {/* 스크롤 참조 지점 */}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* 메시지 입력 영역 */}
      <div className="p-4 bg-white border-t">
        <form onSubmit={handleSendMessage} className="flex">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="메시지를 입력하세요..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 focus:outline-none"
          >
            전송
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatRoom;
