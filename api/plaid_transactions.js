// api/plaid_transactions.js
import { plaidClient, admin } from "./_init.js";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { uid } = req.query;
    if (!uid) return res.status(400).json({ error: "Missing UID" });

    try {
        const userRef = admin.firestore().collection("userPortfolios").doc(uid);
        const userDoc = await userRef.get();
        const plaidData = userDoc.data()?.plaid;

        if (!plaidData?.access_token) {
            return res.status(400).json({ error: "No Plaid access token found" });
        }

        const startDate = "2024-09-01";
        const endDate = new Date().toISOString().split("T")[0];

        const plaidRes = await plaidClient.transactionsGet({
            access_token: plaidData.access_token,
            start_date: startDate,
            end_date: endDate,
        });

        const transactions = plaidRes.data.transactions;
        console.log(`✅ Retrieved ${transactions.length} transactions from Plaid for UID: ${uid}`);

        // Return Plaid data only — no Firestore writes
        res.status(200).json({ transactions });
    } catch (err) {
        console.error("🚨 Error fetching Plaid transactions:", err.response?.data || err);
        res.status(500).json({ error: "Failed to fetch Plaid transactions" });
    }
}
