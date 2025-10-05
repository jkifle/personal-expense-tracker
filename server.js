// server.js
import express from "express";
import cors from "cors";
import admin from "firebase-admin";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// ===== Middleware =====
app.use(cors({ origin: "*" })); // Allow all origins; adjust in production
app.use(express.json());

// ===== Firebase Admin Initialization =====
try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });

    console.log("✅ Firebase Admin initialized successfully");
} catch (error) {
    console.error("🚨 Failed to initialize Firebase Admin:", error);
    process.exit(1);
}

// ===== API Routes =====
app.get("/api/transactions", async (req, res) => {
    const { uid } = req.query;
    if (!uid) return res.status(400).json({ error: "Missing UID" });

    try {
        const snapshot = await admin.firestore().collection("transactions")
            .where("uid", "==", uid)
            .get();

        const transactions = snapshot.docs.map(doc => doc.data());
        res.json({ transactions });
    } catch (error) {
        console.error("🚨 Error fetching transactions:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// ===== Serve React Frontend =====
const distPath = path.join(__dirname, "dist"); // Vite build folder
app.use(express.static(distPath));

// Serve React frontend for any route not handled by /api
app.use((req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    res.sendFile(path.join(distPath, "index.html"));
});


// ===== Start Server =====
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
