// socket event 응답을 포맷팅하는 함수
function formatResponse(status, message, data) {
  return {
    status: status,
    message: message,
    data: data,
    timestamp: new Date().toISOString(),
  };
}

module.exports = formatResponse;
