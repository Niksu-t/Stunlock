import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express()
const port = 3001

app.use('/api', createProxyMiddleware({
  target: 'http://localhost:3000',
  changeOrigin: true,
}));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static('dist'));

const pages = ['login', 'register', "dashboard"];

// Redirect pretty URLs to correct HTML files
pages.forEach(page => {
    app.get(`/${page}`, (req, res) => {
        res.sendFile(path.join(__dirname, '/dist', `${page}.html`));
    });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})