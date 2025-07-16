const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();

// Proxy API Suitmedia
app.use('/api', createProxyMiddleware({
  target: 'https://suitmedia-backend.suitdev.com',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/api',
  },
}));

// Proxy untuk gambar (gambar dari assets.suitdev.com)
app.use('/assets-proxy', createProxyMiddleware({
  target: 'https://assets.suitdev.com',
  changeOrigin: true,
  pathRewrite: {
    '^/assets-proxy': '',
  },
}));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
