const axios = require("axios");

/**
 * 현재 회원이 속한 채팅방의 uuid 목록을 요청하는 메소드
 * @param {*} socket
 * @returns
 */
async function fetchChatroomUuid(socket) {
  try {
    const response = await axios.get("http://localhost:8080/v1/member/chatroom/uuid", {
      headers: {
        Authorization: `Bearer ${socket.token}`,
      },
    });
    if (response.data.isSuccess) {
      return response.data.result;
    } else {
      throw new Error(`Failed to fetch chatroom uuid: ${response.data.message}`);
    }
  } catch (error) {
    console.error("Error fetching chatroom uuid data:", error);
    throw error;
  }
}

module.exports = {
  fetchChatroomUuid,
};
