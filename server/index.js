import cookieParser from 'cookie-parser';
import fetch from 'node-fetch';
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express()
const port = 3001

app
.use('/api', createProxyMiddleware({
  target: 'http://localhost:3000',
  changeOrigin: true,
}))
.use(cookieParser());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static('dist'));

const pages = ['login', 'register', "dashboard"];

// Redirect pretty URLs to correct HTML files
pages.forEach(page => {
  app.get(`/${page}`, async (req, res) => {
    /*
    console.log(req.cookies?.auth_token)
    let headers = {
      Authorization: `Bearer ${req.cookies?.auth_token}`
    }
    

    const options = {
      headers: headers,
      credentials: "include"
    }

    const data = await fetch("http://localhost:3001/api/auth/me", options)
        .then((response) => {
            if(!response.ok) {
                throw new Error("Connection error")
            }
            else {
              return response.json();
            }
        })
    console.log(data.user);
    */
    res.sendFile(path.join(__dirname, '/dist', `${page}.html`));
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})