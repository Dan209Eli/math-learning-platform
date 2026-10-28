const express = require('express');
const app = express();
const PORT = 3000;

// A simple test route for our backend API
app.get('/api/health', (req, res) => {
    res.json({ message: "Hello from the backend kitchen! Everything is running smoothly." });
});

// Start listening for requests on port 3000
app.listen(PORT, () => {
    console.log(`Backend server is running live at http://localhost:${PORT}`);
});