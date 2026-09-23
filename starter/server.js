const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

// Helper function to read and serve files
function serveFile(res, filePath, contentType, statusCode = 200) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      handleServerError(res);
    } else {
      res.writeHead(statusCode, { 'Content-Type': contentType });
      res.end(data);
    }
  });
}

// Handle 404 errors
function handle404(res) {
  const filePath = path.join(__dirname, 'public', '404.html');
  serveFile(res, filePath, 'text/html', 404);
}

// Handle 500 errors
function handleServerError(res) {
  const filePath = path.join(__dirname, 'public', '500.html');
  serveFile(res, filePath, 'text/html', 500);
}

const server = http.createServer((req, res) => {
  console.log(`Received request: ${req.url}`);

  // Routing for HTML pages
  if (req.url === '/' || req.url === '/index.html') {
    serveFile(res, path.join(__dirname, 'public', 'index.html'), 'text/html');
  } 
  else if (req.url === '/about') {
    serveFile(res, path.join(__dirname, 'public', 'about.html'), 'text/html');
  } 
  else if (req.url === '/contact') {
    serveFile(res, path.join(__dirname, 'public', 'contact.html'), 'text/html');
  } 
  // Serving CSS files
  else if (req.url.startsWith('/styles/')) {
    const safePath = path.normalize(req.url).replace(/^(\.\.[\/\\])+/, '');
    const filePath = path.join(__dirname, 'public', safePath);
    
    fs.readFile(filePath, (err, data) => {
      if (err) {
        handle404(res);
      } else {
        res.writeHead(200, { 'Content-Type': 'text/css' });
        res.end(data);
      }
    });
  } 
  // Bonus API Endpoint
  
  else if (req.url === '/api/time') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ currentTime: new Date().toISOString() }));
  } 
  // Catch-all route for 404
  else {
    handle404(res);
  }
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});