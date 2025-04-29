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

const non_protected_routes = ['login', 'register'];

non_protected_routes.forEach(page => {
  app.get(`/${page}`, async (req, res) => {
    console.log(`Request received for: ${page}`)

    res.set('Cache-Control', 'no-store');

    res.sendFile(path.join(__dirname, '/dist', `${page}.html`));
  });
});

const login_protected_routes = ["dashboard", "settings"];

login_protected_routes.forEach(page => {
  app.get(`/${page}`, async (req, res) => {
    console.log(`Protected request received for: ${page}`)
    res.set('Cache-Control', 'no-store');

    let auth_success = false;

    if(req.cookies?.auth_token) {
      let headers = {
        Cookie: `auth_token=${req.cookies.auth_token}`
      };
      
      const options = {
        headers: headers,
        credentials: "include"
      }
  
      const data = await fetch("http://localhost:3001/api/auth/me", options)
        .then((response) => {
          if(response.ok)
            return response.json();
        })

      if(data) {
        auth_success = true
      }
    }
    
    if(auth_success) {
      return res.sendFile(path.join(__dirname, '/dist', `${page}.html`));
    }
    else {
      return res.redirect(301, '/login')
    }
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})