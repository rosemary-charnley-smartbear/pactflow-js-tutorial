const express = require('express');
const app = express();
const port = 8081;

// Sample data for user
const users = {
    1: { id: 1, name: 'John Doe', age: 30 },
    2: { id: 2, name: 'Jane Doe', age: 25 }
};

// Endpoint to get user by ID
app.get('/user/:id', (req, res) => {
    const user = users[req.params.id];
    if (user) {
        res.json(user);
    } else {
        res.status(404).send({ message: 'User not found' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Provider service running on http://localhost:${port}`);
});
