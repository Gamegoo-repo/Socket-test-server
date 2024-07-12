const axios = require("axios");

// 8080서버로 해당 회원의 친구목록 조회 api를 실행
async function fetchFriends(socket) {
  try {
    const response = await axios.get("http://localhost:8080/v1/member/friends", {
      headers: {
        Authorization: `Bearer ${socket.token}`,
      },
    });
    if (response.data.isSuccess) {
      return response.data.result.friendInfoDtoList;
    } else {
      console.error("Failed to fetch friends: ", response.data.message);

      //throw new Error(`Failed to fetch friends: ${response.data.message}`);
    }
  } catch (error) {
    console.error("Error fetching friends data:");
    console.error("JWT value: ", socket.token);
    //throw error;
    return [];
  }
}

module.exports = {
  fetchFriends,
};
