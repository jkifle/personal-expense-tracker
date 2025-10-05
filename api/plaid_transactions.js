import { admin, plaidClient } from "./_init.js";

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
        const batch = admin.firestore().batch();
        const expensesRef = userRef.collection("Expenses");

        transactions.forEach((tx) => {
            const docRef = expensesRef.doc(tx.transaction_id);
            batch.set(
                docRef,
                {
                    name: tx.name,
                    amount: tx.amount,
                    date: new Date(tx.date),
                    category: tx.category?.[0] || "Uncategorized",
                    merchant_name: tx.merchant_name || null,
                    pending: tx.pending,
                    account_id: tx.account_id,
                    plaid_id: tx.transaction_id,
                    createdAt: admin.firestore.FieldValue.serverTimestamp(),
                },
                { merge: true }
            );
        });

        await batch.commit();
        console.log(`✅ Stored ${transactions.length} transactions for UID: ${uid}`);
        res.status(200).json({ transactions });
    } catch (err) {
        console.error("🚨 Error fetching/storing transactions:", err.response?.data || err);
        res.status(500).json({ error: "Failed to fetch/store Plaid transactions" });
    }
}
