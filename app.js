const express = require('express');
const ApiError = require("./app/api-error");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const contactsRouter = require("./app/routes/contact.route");
const authRouter = require("./app/routes/auth.routes");

app.use("/api/auth", authRouter);

// Test API
app.get("/", (req, res) => {
    res.json({ message: "Welcome to contact book application." });
});
app.get("/api/test", (req, res) => {
    res.send("API OK");
});
app.use("/api/contacts", (req, res, next) => {
    console.log("🔥 HIT CONTACT:", req.method);
    next();
}, contactsRouter);
// 404 handler
app.use((req, res, next) => {
    return next(new ApiError(404, "Resource not found"));
});

// Error handler
app.use((error, req, res, next) => {
    return res.status(error.statusCode || 500).json({
        message: error.message || "Internal Server Error",
    });
});

module.exports = app;