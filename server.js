// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import admin from "firebase-admin";
import bodyParser from "body-parser";
import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";

// Setup __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Initialize Firebase Admin
try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
    console.log("✅ Firebase Admin initialized successfully");
} catch (err) {
    console.error("🚨 Failed to initialize Firebase Admin:", err);
}


// ---- Initialize Plaid client ----
const plaidConfig = new Configuration({
    basePath: PlaidEnvironments.sandbox, // Sandbox environment
    baseOptions: {
        headers: {
            "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
            "PLAID-SECRET": process.env.PLAID_SECRET,
        },
    },
});
const plaidClient = new PlaidApi(plaidConfig);

// ---- Plaid Endpoints ----
app.post("/api/create_link_token", async (req, res) => {
    const { uid } = req.body;

    if (!uid) return res.status(400).json({ error: "Missing UID" });

    try {
        const response = await plaidClient.linkTokenCreate({
            user: { client_user_id: uid },
            client_name: "My Expense Tracker",
            products: ["transactions"],   // Products you want to access
            country_codes: ["US"],
            language: "en",
        });

        const linkToken = response.data.link_token;
        res.json({ link_token: linkToken });
    } catch (err) {
        console.error("❌ Error creating Plaid link token:", err.response?.data || err);
        res.status(500).json({ error: "Failed to create link token" });
    }
});

// Exchange Plaid public_token for access_token
app.post("/api/exchange_public_token", async (req, res) => {
    const { uid, public_token } = req.body;

    if (!uid || !public_token) {
        return res.status(400).json({ error: "Missing UID or public_token" });
    }

    try {
        // Exchange the public_token for an access_token
        const exchangeResponse = await plaidClient.itemPublicTokenExchange({
            public_token,
        });

        const access_token = exchangeResponse.data.access_token;
        const item_id = exchangeResponse.data.item_id;

        // Store the access_token securely in Firebase under user's document
        const userRef = admin.firestore().collection("userPortfolios").doc(uid);
        await userRef.set(
            {
                plaid: {
                    access_token,
                    item_id,
                    lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
                },
            },
            { merge: true } // Merge so we don't overwrite other user data
        );

        console.log(`✅ Stored Plaid access_token for UID: ${uid}`);
        res.json({ success: true });
    } catch (err) {
        console.error(
            "🚨 Error exchanging public token:",
            err.response?.data || err
        );
        res.status(500).json({ error: "Failed to exchange public token" });
    }
});


// GET /api/transactions?uid=<uid>
app.get("/api/transactions", async (req, res) => {
    const { uid } = req.query;
    if (!uid) return res.status(400).json({ error: "Missing UID" });

    try {
        const expensesRef = admin
            .firestore()
            .collection("userPortfolios")
            .doc(uid)
            .collection("Expenses");

        const snapshot = await expensesRef.get();

        const transactions = snapshot.docs.map(doc => ({
            docId: doc.id,
            ...doc.data()
        }));

        console.log("Transactions fetched for UID:", uid, transactions.length);

        res.json({ transactions });
    } catch (err) {
        console.error("Error fetching transactions:", err);
        res.status(500).json({ error: "Failed to fetch transactions" });
    }
});


// ---- Serve React / Vite build ----
app.use(express.static(path.join(__dirname, "dist"))); // Vite build folder

// Catch-all route for React Router (must come AFTER all API routes)
app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
