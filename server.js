const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Route to fetch blog posts
app.get('/api/posts', (req, res) => {
    fs.readFile(path.join(__dirname, 'data', 'posts.json'), 'utf-8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading posts');
        } else {
            res.json(JSON.parse(data));
        }
    });
});

// Serve the blog page
app.get('/blog', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'blog.html'));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
