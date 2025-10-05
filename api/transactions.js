// api/transactions.js
import admin from "firebase-admin";

// Initialize Firebase Admin SDK once
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        }),
    });
}

const db = admin.firestore();

export default async function handler(req, res) {
    // CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*"); // or restrict to your frontend domains
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { uid } = req.query;
        if (!uid) return res.status(400).json({ error: "Missing UID" });

        const userTransactionsRef = db.collection("transactions").where("uid", "==", uid);
        const snapshot = await userTransactionsRef.get();

        const transactions = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            if (data.id) transactions.push(data);
        });

        return res.status(200).json({ transactions });
    } catch (error) {
        console.error("Error fetching transactions:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}
