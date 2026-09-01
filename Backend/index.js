import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

import kitchenRoute from "./route/kitchen.route.js";
import userRoute from "./route/user.route.js";  // Fixed import path
import razorpayRoute from "./route/razorpay.route.js";  // Fixed import path
import menuRoute from "./route/menu.route.js";  // ✅ Import the menu route

import path from "path";
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(cors());
app.use(express.json());

dotenv.config();

const PORT = process.env.PORT || 4000;
const URI = process.env.MONGODB_URI || process.env.MongoDBURI;

mongoose.connection.on("connected", () => console.log("Connected to database"));
mongoose.connection.on("error", (error) => console.error("Database connection error:", error.message));

if (URI) {
    mongoose.connect(URI).catch((error) => {
        console.error("Database connection failed:", error.message);
    });
} else {
    console.error("MongoDB URI is not configured");
}

app.get("/", (_req, res) => {
    res.status(200).json({ status: "ok", service: "food-treasure-backend" });
});

app.get("/health", (_req, res) => {
    const connected = mongoose.connection.readyState === 1;
    res.status(connected ? 200 : 503).json({
        status: connected ? "ok" : "degraded",
        database: connected ? "connected" : "disconnected",
    });
});

// ✅ Register all routes
app.use("/kitchen", kitchenRoute);
app.use("/kitchen/menu", menuRoute);  // ✅ Ensure the menu route is registered under `/kitchen/menu`
app.use("/user",userRoute);
app.use("/v1", razorpayRoute);
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});
