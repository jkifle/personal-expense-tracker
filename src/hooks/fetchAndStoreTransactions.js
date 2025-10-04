// src/hooks/fetchAndStoreTransactions.js
import axios from "axios";
import { db } from "../firebase/firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

/**
 * Fetch transactions from backend and store in Firestore under userPortfolios/uid/Expenses
 * @param {string} uid - Firebase UID of the current user
 */
const fetchAndStoreTransactions = async (uid) => {
  if (!uid) {
    console.error("Missing UID in fetchAndStoreTransactions");
    return;
  }

  try {
    // Fetch transactions from your API
    const response = await axios.get("/api/transactions", { params: { uid } });
    const transactions = response.data;

    for (const txn of transactions) {
      // Check for duplicates using transaction_id
      const txnQuery = query(
        collection(db, "userPortfolios", uid, "Expenses"),
        where("transaction_id", "==", txn.transaction_id)
      );
      const existing = await getDocs(txnQuery);
      if (!existing.empty) continue; // Skip duplicate

      // Prepare transaction object
      const cleanTxn = {
        account_id: txn.account_id,
        amount: txn.amount,
        category: Array.isArray(txn.category)
          ? txn.category.join(" > ")
          : "Uncategorized",
        date: txn.date ? new Date(txn.date) : new Date(),
        name: txn.name,
        transaction_id: txn.transaction_id,
        createdAt: new Date(),
      };

      // Add to Firestore
      await addDoc(collection(db, "userPortfolios", uid, "Expenses"), cleanTxn);
    }

    console.log(`Transactions for user ${uid} saved to Firestore!`);
  } catch (err) {
    console.error(
      "Error fetching/storing transactions:",
      err.response?.data || err.message || err
    );
  }
};

export default fetchAndStoreTransactions;
