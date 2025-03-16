const express = require('express');
const path = require('path');
const fs = require('fs').promises; // Use async/await for cleaner code

const app = express();
const PORT = process.env.PORT || 3000;

const dataDir = path.join(__dirname, 'data');
const filePath = path.join(dataDir, 'posts.json');

// Ensure data folder and posts.json exist before starting server
(async () => {
    try {
        await fs.mkdir(dataDir, { recursive: true });
        try {
            await fs.access(filePath);
        } catch {
            await fs.writeFile(filePath, '[]', 'utf8');
            console.log('✅ posts.json was missing. Created an empty one.');
        }
    } catch (err) {
        console.error('❌ Error setting up data folder:', err);
        process.exit(1); // Stop server if file setup fails
    }
})();

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Route to fetch blog posts
app.get('/api/posts', async (req, res) => {
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        res.json(JSON.parse(data));
    } catch (err) {
        console.error('❌ Error reading posts.json:', err);
        res.status(500).json({ error: 'Error reading posts.json' });
    }
});

// Serve HTML pages
app.get('/blog', (req, res) => res.sendFile(path.join(__dirname, 'views', 'blog.html')));
app.get('/about', (req, res) => res.sendFile(path.join(__dirname, 'views', 'about.html')));
app.get('/contact', (req, res) => res.sendFile(path.join(__dirname, 'views', 'contact.html')));

// Root Route for Health Check
app.get('/', (req, res) => res.send('🚀 Server is live!'));

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
