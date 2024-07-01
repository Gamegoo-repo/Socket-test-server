const axios = require("axios");

// 친구 정보를 가져오는 함수
async function fetchFriends(socket) {
  try {
    const response = await axios.get("http://localhost:8080/v1/member/friends", {
      headers: {
        Authorization: `Bearer ${socket.handshake.headers["authorization"].split(" ")[1]}`,
      },
    });
    if (response.data.isSuccess) {
      return response.data.result.friendInfoDtoList;
    } else {
      throw new Error(`Failed to fetch friends: ${response.data.message}`);
    }
  } catch (error) {
    console.error("Error fetching friends data:", error);
    throw error;
  }
}

module.exports = {
  fetchFriends,
};
