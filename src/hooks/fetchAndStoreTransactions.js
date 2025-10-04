// src/hooks/fetchAndStoreTransactions.js
import axios from "axios";
import { db } from "../firebase/firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

const API_BASE_URL = "https://personal-expense-tracker-4rirpazjl-jkifles-projects.vercel.app/api"; // replace with your deployed Vercel domain

const fetchAndStoreTransactions = async (uid) => {
  if (!uid) {
    console.error("Missing UID in fetchAndStoreTransactions");
    return;
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/transactions`, {
      params: { uid },
      headers: { "Content-Type": "application/json" },
    });

    const transactions = response.data;

    if (!Array.isArray(transactions)) {
      console.error("Transactions response is not an array:", transactions);
      return;
    }

    for (const txn of transactions) {
      if (!txn.transaction_id) {
        console.warn("Skipping transaction without ID:", txn);
        continue;
      }

      // Check for duplicates
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
        date: txn.date ? new Date(txn.date) : new Date(),
        name: txn.name || "Unknown",
        transaction_id: txn.transaction_id,
        createdAt: new Date(),
      };

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
