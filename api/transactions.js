// /api/transactions.js
import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/firebase"; // adjust path as needed

// Initialize Plaid client using environment variables
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
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { uid } = req.query;

        if (!uid) {
            console.error("Missing UID in query params");
            return res.status(400).json({ error: "UID is required" });
        }

        // Fetch access token from Firestore
        const tokenDocRef = doc(db, "plaidTokens", uid);
        const tokenDoc = await getDoc(tokenDocRef);

        if (!tokenDoc.exists()) {
            console.error(`No access token found for UID: ${uid}`);
            return res.status(400).json({ error: "No access token found for this user" });
        }

        const accessToken = tokenDoc.data()?.accessToken;
        if (!accessToken) {
            console.error(`Access token is empty for UID: ${uid}`);
            return res.status(400).json({ error: "Access token is missing" });
        }

        // Compute date range: last 30 days
        const today = new Date().toISOString().split("T")[0];
        const past = new Date();
        past.setDate(past.getDate() - 30);
        const thirtyDaysAgo = past.toISOString().split("T")[0];

        console.log(`Fetching transactions for UID: ${uid} from ${thirtyDaysAgo} to ${today}`);

        // Call Plaid API
        const transactionsResponse = await plaidClient.transactionsGet({
            access_token: accessToken,
            start_date: thirtyDaysAgo,
            end_date: today,
        });

        const transactions = transactionsResponse.data.transactions || [];
        console.log(`Retrieved ${transactions.length} transactions`);

        res.status(200).json(transactions);
    } catch (error) {
        console.error("Error fetching transactions:", error.response?.data || error.message || error);
        res.status(500).json({ error: "Internal server error fetching transactions" });
    }
}
