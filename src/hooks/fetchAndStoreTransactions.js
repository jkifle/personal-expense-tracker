import axios from 'axios';
import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useAuth } from './contexts/authContexts'; // optional: if you track current user

export const fetchAndStoreTransactions = async () => {
    try {
        const response = await axios.get('http://localhost:8000/transactions');
        const transactions = response.data;

        const { currentUser } = useAuth(); // optional if you store data per user
        const uid = currentUser?.uid || "test-user";

        for (const txn of transactions) {
            const cleanTxn = {
                account_id: txn.account_id,
                amount: txn.amount,
                category: txn.category.join(" > "),
                date: txn.date,
                name: txn.name,
                createdAt: new Date()
            };

            await addDoc(collection(db, "userPortfolios", uid, "Expenses"), cleanTxn);
        }

        console.log("Transactions saved to Firestore!");
    } catch (err) {
        console.error("Error fetching/storing transactions:", err);
    }
};
