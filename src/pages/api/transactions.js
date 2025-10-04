// pages/api/transactions.js
import { db } from "../../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";

export default async function handler(req, res) {
    try {
        const { uid } = req.query;

        if (!uid) {
            return res.status(400).json({ error: "Missing UID" });
        }

        const expensesRef = collection(db, "userPortfolios", uid, "Expenses");
        const snapshot = await getDocs(expensesRef);

        const transactions = snapshot.docs.map(doc => ({
            docId: doc.id,
            ...doc.data(),
        }));

        return res.status(200).json(transactions);
    } catch (error) {
        console.error("Error fetching transactions:", error);
        return res.status(500).json({ error: "Failed to fetch transactions" });
    }
}
