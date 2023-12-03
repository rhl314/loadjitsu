const express = require('express');
const app = express();

// Middleware to add a random wait time
app.use((req, res, next) => {
    const waitTime = Math.floor(Math.random() * (2000 - 100 + 1)) + 100;
    setTimeout(next, waitTime);
});

// GET /api route
app.get('/api', (req, res) => {
    console.log("Received");
    const randomStatus = [200, 404, 503][Math.floor(Math.random() * 3)];
    res.sendStatus(randomStatus);
});

// Listen on port 3000
app.listen(3000, () => {
    console.log('Server running on port 3000');
});