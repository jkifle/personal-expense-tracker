// /api/transactions.js
import { DB, admin } from "../../../lib/firebaseAdmin"; // make sure this is your server-side admin SDK
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import axios from "axios";

export default async function handler(req, res) {
    // ---------------------
    // CORS Headers
    // ---------------------
    res.setHeader("Access-Control-Allow-Origin", "https://personal-expense-tracker-fxhsir8q2-jkifles-projects.vercel.app");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    // Handle preflight (OPTIONS)
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }
    // ---------------------
    // Only GET supported
    // ---------------------
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { uid } = req.query;
        if (!uid) {
            return res.status(400).json({ error: "Missing UID" });
        }

        // ---------------------
        // Retrieve user's Plaid access token from Firestore (server-side)
        // ---------------------
        const tokenDoc = await getDocs(
            query(collection(DB, "userPortfolios", uid, "tokens"))
        );

        if (tokenDoc.empty) {
            return res.status(401).json({ error: "No Plaid token found for user" });
        }

        const accessToken = tokenDoc.docs[0].data().access_token;
        if (!accessToken) {
            return res.status(401).json({ error: "Invalid Plaid token" });
        }

        // ---------------------
        // Fetch transactions from Plaid
        // ---------------------
        const now = new Date();
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 1);

        const plaidResponse = await axios.post(
            "https://sandbox.plaid.com/transactions/get",
            {
                client_id: process.env.PLAID_CLIENT_ID,
                secret: process.env.PLAID_SECRET,
                access_token: accessToken,
                start_date: startDate.toISOString().slice(0, 10),
                end_date: now.toISOString().slice(0, 10),
            }
        );

        const transactions = plaidResponse.data.transactions || [];

        // ---------------------
        // Store transactions in Firestore if not already present
        // ---------------------
        for (const txn of transactions) {
            if (!txn.transaction_id) {
                console.warn("Skipping transaction without ID:", txn);
                continue;
            }

            const txnQuery = query(
                collection(DB, "userPortfolios", uid, "Expenses"),
                where("transaction_id", "==", txn.transaction_id)
            );
            const existing = await getDocs(txnQuery);
            if (!existing.empty) continue;

            const cleanTxn = {
                account_id: txn.account_id,
                amount: txn.amount,
                category: Array.isArray(txn.category) ? txn.category.join(" > ") : "Uncategorized",
                date: new Date(txn.date),
                name: txn.name,
                transaction_id: txn.transaction_id,
                createdAt: new Date(),
            };

            await addDoc(collection(DB, "userPortfolios", uid, "Expenses"), cleanTxn);
        }

        res.status(200).json(transactions);
    } catch (err) {
        console.error("Error fetching/storing transactions:", err.response?.data || err.message || err);
        res.status(500).json({ error: "Server error", details: err.message });
    }
}
