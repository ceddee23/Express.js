const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Ensure data folder and posts.json exist
const dataDir = path.join(__dirname, 'data');
const filePath = path.join(dataDir, 'posts.json');

if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '[]', 'utf8');
    console.log('posts.json was missing. Created an empty one.');
}

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Redirect root URL ("/") to "/blog"
app.get('/', (req, res) => {
    res.redirect('/blog');
});

// Route to fetch blog posts
app.get('/api/posts', (req, res) => {
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            console.error('Error reading posts.json:', err);
            return res.status(500).json({ error: 'Error reading posts.json' });
        }
        try {
            res.json(JSON.parse(data));
        } catch (parseErr) {
            console.error('Error parsing posts.json:', parseErr);
            res.status(500).json({ error: 'Invalid JSON format' });
        }
    });
});

// Serve HTML pages
app.get('/blog', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'blog.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'about.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'contact.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});
