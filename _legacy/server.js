const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the current directory
app.use(express.static(__dirname));

// Route for the home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Basic route handling for other HTML pages (optional, static middleware handles most)
app.get('/:page', (req, res) => {
    const page = req.params.page;
    if (page.endsWith('.html')) {
        res.sendFile(path.join(__dirname, page));
    } else {
        // Try appending .html if not present
        res.sendFile(path.join(__dirname, page + '.html'), (err) => {
            if (err) {
                // Fallback or 404
                res.status(404).send('Page not found');
            }
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
