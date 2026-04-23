import express from 'express';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';

import { addRefreshToken, createUser, getAllUsers, getUserByEmail, removeRefreshToken, validateRefreshToken } from './database/database.js';
import { authenticateToken } from './middleware/auth.js';
import { checkUserRole } from './middleware/role.middleware.js';

const JWT_SECRET = 'mysecretkey';

// CREATE A SERVER APP AND USER MIDDLEWARES
const app = express();

app.use(
    cors({
        origin: 'http://127.0.0.1:3000',
        credentials: true
    })
);
app.use(express.json());
app.use(cookieParser());



// TEST ROUTE
app.get("/", (req, res) => {
    res.send("Hello from server");
});
 
// REGISTER THE USER
app.post("/api/register", async (req, res) => {
    const {name, email, password} = req.body;

    if(!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "Name, email and password are required",
            data: null
        })
    }

    const existingUser = getUserByEmail(email);
    if(existingUser) {
        return res.status(400).json({
            success: false,
            message: `User with email ${email} already exists`,
            data: null
        })
    }

    const salt = 10;
    const hashedPassword =  await bcrypt.hash(password, salt);

    // DEFAULT ROLE IS USER, CAN BE CHANGED TO ADMIN MANUALLY IN DATABASE FOR INSTANCE
    const role = "user";
    const newUser = createUser(name, email, hashedPassword, role);
    res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: {
            userId: newUser.userId,
            name: newUser.name,
            email: newUser.email
        }
    })
});

// ALLOW THEM TO LOGIN
app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
    if(!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and password are required",
            data: null 
        });
    };

    const user = getUserByEmail(email);
    if(!user) {
        return res.status(400).json({
          success: false,
          message: "User not found",
          data: null,
        });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid) {
        return res.status(400).json({
          success: false,
          message: "Password is incorrect",
          data: null,
        });
    }

    const refreshToken = jwt.sign({ email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });
    // STORE THE REFRESH TOKEN IN THE DB
    addRefreshToken(refreshToken);

    const accessToken = jwt.sign({ name: user.name, email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: "10m",
    });

    // WE SHARE THIS REFRESH TOKEN TO THE USER IN THE SECURE HTTPONLY REQUEST COOKIES
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false, // SET TO TRUE IN PRODUCTION WITH HTTPS
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    // TO REMOVE COOKIE
    // res.clearCookie("refreshToken");

    res.status(200).json({
        success: true,
        message: "Login successfully",
        data: {
            name: user.name,
            email: user.email,
            role: user.role,
            // REMOVE REFRESH TOKEN FROM HERE AND SEND IT IN THE HTTPONLY COOKIES
            // refreshToken: refreshToken,
            accessToken: accessToken
        }
    })
});

// ALLOW USERS TO ACCESS THEIR PROFILE -> PROTECTED ROUTE
app.get("/api/dashboard", authenticateToken, (req, res) => {
    const user = req.user;
    res.status(200).json({
        success: true,
        message: `Welcome ${user.name} to your dashboard`,
        data: user
    })
});

// ALLOW ADMIN TO ACCESS ALL USERS -> ROLE BASED PROTECTED ROUTE
app.get("/api/admin", authenticateToken, checkUserRole("admin"), (req, res) => {
    const users = getAllUsers();
    const admin = req.user;
    res.status(200).json({
        success: true,
        message: "Welcom to admin dashboard",
        data: {
            users,
            admin: admin
        }
    })
})

// REFRESH THE USER NEW TOKEN
app.post("/api/refresh-token", (req, res) => {

    // NOW WE ARE GETTING REFRESH TOKEN VIA COOKIES
    // const { refreshToken } = req.body;

    const refreshToken = req.cookies.refreshToken;

    if(!refreshToken) {
        return res.status(400).json({
            success: false,
            message: "Refresh token is required",
            data: null
        })
    }

    if(!validateRefreshToken(refreshToken)) {
        return res.status(403).json({
            success: false,
            message: "Invalid refresh token",
            data: null
        })
    }

    try {
        const decode = jwt.verify(refreshToken, JWT_SECRET);

        if(!decode.email) {
            removeRefreshToken(refreshToken);
            return res.status(400).json({
                success: false,
                message: "Invalid token payload, please login again",
                data: null
            })
        }
        const user = getUserByEmail(decode.email);
        if(!user) {
            return res.status(400).json({
                success: false,
                message: "User not found",
                data: null
            })
        }

        const newAccessToken = jwt.sign(
          { name: user.name, email: user.email, role: user.role },
          JWT_SECRET,
          { expiresIn: "10m" },
        );

        // THIS IS CALLED REFRESH TOKEN ROTATION, WE GENERATE A NEW REFRESH TOKEN AND INVALIDATE THE OLD ONE
        const newRefreshToken = jwt.sign({ email: user.email }, JWT_SECRET, {expiresIn: "7d"});
        removeRefreshToken(refreshToken);
        addRefreshToken(newRefreshToken);

        // ADD NEW REFRESH TOKEN TO COOKIES
         res.cookie("refreshToken", newRefreshToken, {
           httpOnly: true,
           secure: false, // SET TO TRUE IN PRODUCTION WITH HTTPS
           sameSite: "none",
           maxAge: 7 * 24 * 60 * 60 * 1000,
         });

        return res.status(200).json({
            success: true,
            message: "Token refreshed successfully",
            data: {
                accessToken: newAccessToken,
                // refreshToken: newRefreshToken
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Your refresh token is expired, please login again",
            data: null
        })
    }
});

app.listen(5000, () => {
    console.log("Server is running: http://localhost:5000");
});
