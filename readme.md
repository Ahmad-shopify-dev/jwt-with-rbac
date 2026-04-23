# JWT AUTHENTICATION IMPLEMENTATION

A complete JWT authentication implementation using:

* Access Token
* Refresh Token
* Token Rotation
* HttpOnly Cookies
* Role-Based Authorization
* Frontend Token Handling
* CORS Handling

This project demonstrates **professional JWT authentication flow** with separated frontend and backend.

---

# FOLDER STRUCTURE

```
jwt-implementation
│
├── backend
│     ├── controllers
│     ├── middleware
│     ├── routes
│     ├── utils
│     ├── data
│     ├── server.js
│     └── package.json
│
├── frontend
│     ├── routes
│     │     ├── dashboard.html
│     │     ├── admin-dashboard.html
│     │     └── expiredtoken.html
│     │
│     ├── index.html
│     ├── script.js
│     └── package.json
```

---

# PROJECT INITIALIZATION

## Backend Setup

```
cd backend
npm init -y

npm install express jsonwebtoken cors cookie-parser bcrypt
npm install --save-dev nodemon
```

Add script:

```
"scripts": {
  "dev": "nodemon server.js"
}
```

Run backend:

```
npm run dev
```

---

## Frontend Setup

```
cd frontend
npm init -y

npm install local-server
```

Add script:

```
"start": "local-server --port=3000 --open=./index.html"
```

Run frontend:

```
npm start
```

---

# BACKEND STRUCTURE FOR APP

Typical backend flow:

```
server.js
│
├── middleware
│     ├── authMiddleware.js
│     ├── roleMiddleware.js
│
├── controllers
│     ├── authController.js
│
├── routes
│     ├── authRoutes.js
│
├── utils
│     ├── tokenUtils.js
│
├── data
│     ├── users.js
```

---

# JWT AUTHENTICATION FLOW

## LOGIN FLOW

1. User sends email & password
2. Backend validates credentials
3. Backend generates:

```
Access Token → Short Life (10 minutes)
Refresh Token → Long Life (7 days)
```

4. Backend sends:

```
Access Token → JSON Response
Refresh Token → HttpOnly Cookie
```

Example:

```js
res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000
});
```

---

# ACCESS TOKEN USAGE

Stored in:

```
localStorage
```

Used in:

```
Authorization Header
```

Example:

```js
headers: {
   Authorization: `Bearer ${token}`
}
```

---

# REFRESH TOKEN FLOW

When:

```
Access Token expires
```

Frontend:

```
POST /api/refresh-token
(credentials included)
```

Backend:

1. Read refresh token from cookie
2. Validate token
3. Generate:

```
New Access Token
New Refresh Token
```

4. Rotate refresh token

---

# REFRESH TOKEN ROTATION

Old refresh token:

```
Removed
```

New refresh token:

```
Generated
Stored
```

Example:

```js
removeRefreshToken(oldToken);

addRefreshToken(newToken);
```

---

# TOKEN EXPIRATION CHECK (Frontend)

```js
function getTokenExpiration(token) {

    try {

        if (!token) return true;

        const payload =
            JSON.parse(atob(token.split('.')[1]));

        const currentTime =
            Math.floor(Date.now() / 1000);

        return payload.exp < currentTime;

    } catch {

        return true;
    }
}
```

---

# FRONTEND AUTH FLOW

On page load:

```
Check access token
If expired → Refresh token
If refresh fails → Redirect login
Else → Load dashboard
```

---

# IMPORTANT: credentials: "include"

Must be added in:

```
Login Request
Refresh Request
Logout Request
```

Example:

```js
fetch('/api/login', {

   method: 'POST',

   credentials: 'include',

   headers: {
       'Content-Type': 'application/json'
   },

   body: JSON.stringify(data)

});
```

---

# ROLE BASED AUTHORIZATION

User Roles:

```
admin
user
```

Middleware:

```js
if(user.role !== "admin") {

   return res.status(403).json({
       message: "Access Denied"
   });

}
```

---

# PASSWORD HASHING (bcrypt)

Password stored as:

```
Hashed Password
```

Example:

```js
const hashedPassword =
   await bcrypt.hash(password, 10);
```

Verify:

```js
await bcrypt.compare(password, user.password);
```

---

# TWO WAYS HERE TO AVOID CORS ERRORS

---

## 1. USING PROXY

```
npm config set proxy http://proxy.example.com:1337
npm config set https-proxy https://proxy.example.com:1337
```

Or:

```
npm config edit
```

Frontend package.json:

```
"start": "live-server --port=3000 --open=./index.html --proxy=--proxy=/api:http:server_host:server_port/api"
```

Important:

```
Use only /api path
Not full backend URL
```

Example:

```js
fetch('/api/register', {

    method: 'POST',

    headers: {
        'Content-Type': 'application/json'
    },

    body: JSON.stringify({
        name,
        email,
        password
    })

});
```

.live-server.json example:

```
{
   "port": 3000,
   "open": "./index.html",
   "proxy": [["/api", ":http://127.0.0.1:5000/api"]],
   "wait": 1000
}
```

---

## 2. BACKEND PACKAGE (npm i cors)

Install:

```
npm i cors
```

Use:

```js
import cors from 'cors';

app.use(cors({
   origin: "http://127.0.0.1:3000",
   credentials: true
}));
```

---

# COOKIE HANDLING

Install:

```
npm install cookie-parser
```

Use:

```js
import cookieParser from 'cookie-parser';

app.use(cookieParser());
```

Read cookie:

```js
const token = req.cookies.refreshToken;
```

---

# SESSION STORAGE OPTION (Alternative)

Instead of:

```
localStorage
```

You can use:

```
sessionStorage
```

Example:

```js
sessionStorage.setItem(
   "accessToken",
   token
);
```

Difference:

| Storage        | Lifetime               |
| -------------- | ---------------------- |
| localStorage   | Until manually removed |
| sessionStorage | Until tab closes       |

---

# SECURITY BEST PRACTICES

✔ Use HttpOnly cookies
✔ Use short access token life
✔ Use refresh token rotation
✔ Hash passwords
✔ Never send passwords to frontend
✔ Filter sensitive fields
✔ Validate tokens on every request

---

# USER DATA FILTERING

Remove sensitive fields:

```js
const usersWithoutPassword =
   users.map(user => {

       const { password, ...rest } = user;

       return rest;

});
```

---

# UI LOGIN AVATARS YOU CAN GET

```
https://ui-avatars.com/
```

Used for:

```
User profile avatars
```

---

# REFRESH TOKEN IN HTTP ONLY COOKIE

Install:

```
npm install cookie-parser
```

Used to:

```
Store refresh token securely
Prevent JavaScript access
Protect against XSS
```

---

# FUTURE IMPROVEMENTS

You can extend this project with:

* MongoDB Integration
* Redis Token Storage
* Session Based Auth
* OAuth Login
* Email Verification
* Password Reset
* Rate Limiting
* CSRF Protection

---

# LEARNING OUTCOME

This project teaches:

✔ JWT Authentication
✔ Token Expiration Handling
✔ Refresh Token Rotation
✔ Cookie Based Authentication
✔ Role-Based Authorization
✔ Frontend Token Handling
✔ Secure Backend Practices

---

# FINAL NOTE

This implementation demonstrates:

```
Professional JWT Authentication Flow
Used in Real Production Systems
```

You can reuse this structure in:

* MERN Stack
* REST APIs
* Fullstack Projects
* SaaS Applications

---
