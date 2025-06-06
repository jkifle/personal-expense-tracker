import axios from "axios";
import { db } from "../firebase/firebase";
import { collection, addDoc } from "firebase/firestore";

const fetchAndStoreTransactions = async (uid) => {
  try {
    const response = await axios.get("http://localhost:8000/transactions");
    const transactions = response.data;

    for (const txn of transactions) {
      const cleanTxn = {
        account_id: txn.account_id,
        amount: txn.amount,
        category: Array.isArray(txn.category)
          ? txn.category.join(" > ")
          : "Uncategorized",
        date: txn.date,
        name: txn.name,
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
