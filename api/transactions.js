import { admin } from "./_init.js";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { uid } = req.query;
    if (!uid) return res.status(400).json({ error: "Missing UID" });

    try {
        const expensesRef = admin
            .firestore()
            .collection("userPortfolios")
            .doc(uid)
            .collection("Expenses");

        const snapshot = await expensesRef.get();
        const transactions = snapshot.docs.map((doc) => ({
            docId: doc.id,
            ...doc.data(),
        }));

        console.log(`✅ Retrieved ${transactions.length} transactions for UID: ${uid}`);
        res.status(200).json(transactions);
    } catch (err) {
        console.error("🚨 Error fetching transactions:", err);
        res.status(500).json({ error: "Failed to fetch transactions" });
    }
}
