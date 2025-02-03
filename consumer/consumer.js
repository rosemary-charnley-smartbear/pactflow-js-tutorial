const axios = require('axios');

async function getUser(userId) {
    const response = await axios.get(`http://localhost:8081/user/${userId}`, {
        headers: {
            'Accept': 'application/json'
        }
});
    return response.data;
}

module.exports = { getUser };
