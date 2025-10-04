import axios from "axios";
import { db } from "../firebase/firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

const fetchAndStoreTransactions = async (uid) => {
  if (!uid) {
    console.error("UID not provided, cannot fetch transactions");
    return;
  }

  try {
    const response = await axios.get(`/api/transactions?uid=${uid}`);
    const transactions = response.data;

    for (const txn of transactions) {
      const q = query(
        collection(db, "userPortfolios", uid, "Expenses"),
        where("transaction_id", "==", txn.transaction_id)
      );

      const existing = await getDocs(q);
      if (!existing.empty) continue;

      const cleanTxn = {
        account_id: txn.account_id,
        amount: txn.amount,
        category: Array.isArray(txn.category)
          ? txn.category.join(" > ")
          : "Uncategorized",
        date: new Date(txn.date),
        name: txn.name,
        transaction_id: txn.transaction_id,
        createdAt: new Date(),
      };

      await addDoc(collection(db, "userPortfolios", uid, "Expenses"), cleanTxn);
    }

    console.log("Transactions saved to Firestore!");
  } catch (err) {
    console.error("Error fetching/storing transactions:", err);
  }
};

export default fetchAndStoreTransactions;
