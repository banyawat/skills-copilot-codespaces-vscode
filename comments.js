// Create web server
const http = require('http');
const fs = require('fs');
const path = require('path');
const comments = require('./comments');

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Content-Security-Policy', "default-src 'self'");

  if (req.method === 'POST') {
    let data = '';

    req.on('data', chunk => {
      data += chunk;
    });

    req.on('end', () => {
      comments.addComment(data, err => {
        if (err) {
          res.statusCode = 500;
          res.end('Server Error');
          return;
        }

        res.statusCode = 201;
        res.end();
      });
    });
  } else {
    res.statusCode = 200;
    fs.createReadStream(path.join(__dirname, 'index.html')).pipe(res);
  }
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});