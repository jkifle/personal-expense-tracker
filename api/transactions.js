import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import admin from "firebase-admin";

// Initialize Firebase Admin (if not already)
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        }),
    });
}
const db = getFirestore();

const config = new Configuration({
    basePath: PlaidEnvironments[process.env.PLAID_ENV],
    baseOptions: {
        headers: {
            "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
            "PLAID-SECRET": process.env.PLAID_SECRET,
        },
    },
});
const plaidClient = new PlaidApi(config);

export default async function handler(req, res) {
    if (req.method !== "GET") return res.status(405).end();

    const { uid } = req.query;
    if (!uid) return res.status(400).json({ error: "Missing uid" });

    try {
        // Get access token from Firestore
        const tokenDoc = await getDoc(doc(db, "userPortfolios", uid, "plaidToken", "token"));
        if (!tokenDoc.exists()) {
            return res.status(400).json({ error: "No access token found" });
        }
        const accessToken = tokenDoc.data().accessToken;

        // Fetch transactions from Plaid
        const today = new Date().toISOString().split("T")[0];
        const past = new Date();
        past.setDate(past.getDate() - 30);
        const thirtyDaysAgo = past.toISOString().split("T")[0];

        const txnsResponse = await plaidClient.transactionsGet({
            access_token: accessToken,
            start_date: thirtyDaysAgo,
            end_date: today,
        });

        res.status(200).json(txnsResponse.data.transactions);
    } catch (error) {
        console.error("Transactions fetch error:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to fetch transactions" });
    }
}
