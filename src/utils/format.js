/**
 * 가격 포맷팅 (천 단위 콤마)
 *
 * @param {number} price - 포맷팅할 가격
 * @returns {string} 천 단위 콤마가 적용된 가격 문자열
 */
export const formatPrice = (price) => {
  return new Intl.NumberFormat('ko-KR').format(price);
};

/**
 * 날짜 포맷팅 (YYYY-MM-DD 또는 HH:MM)
 * 현재 날짜면 시간만 표시하고, 다른 날짜면 연-월-일 형식으로 표시합니다.
 *
 * @param {string} dateString - 포맷팅할 날짜 문자열
 * @returns {string} 포맷팅된 날짜 문자열
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';

  const date = new Date(dateString);

  // 유효한 날짜인지 확인
  if (isNaN(date.getTime())) return '';

  // 현재 날짜와 비교
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  if (isToday) {
    // 오늘 날짜이면 시간만 표시
    return formatTime(dateString);
  } else {
    // 오늘이 아니면 연-월-일 표시
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
      date.getDate(),
    ).padStart(2, '0')}`;
  }
};

/**
 * 시간 포맷팅 (HH:MM)
 *
 * @param {string} dateString - 포맷팅할 날짜 문자열
 * @returns {string} 시:분 형식의 시간 문자열
 */
export const formatTime = (dateString) => {
  if (!dateString) return '';

  const date = new Date(dateString);

  // 유효한 날짜인지 확인
  if (isNaN(date.getTime())) return '';

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${hours}:${minutes}`;
};
