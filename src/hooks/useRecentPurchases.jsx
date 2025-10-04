import { collection, query, getDocs, limit, orderBy } from "firebase/firestore";
import { db } from "../firebase/firebase";

const refreshRecentPurchases = async (uid, setExpenseData, numEntries) => {
  const q = query(
    collection(db, "userPortfolios", uid, "Expenses"),
    orderBy("date", "desc"),
    limit(numEntries)
  );
  const querySnapshot = await getDocs(q);
  const recentExpenses = querySnapshot.docs.map((docSnap) => ({
    docId: docSnap.id,
    img: "../../public/graphic/img/money.png",
    name: docSnap.data().name,
    date: docSnap.data().date,
    amount: docSnap.data().amount,
    category: docSnap.data().category,
  }));
  setExpenseData(recentExpenses);
};

export default refreshRecentPurchases;
