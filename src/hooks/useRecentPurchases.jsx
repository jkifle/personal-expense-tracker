import { collection, query, getDocs, limit, orderBy } from "firebase/firestore";
import { db } from "../firebase/firebase";

const refreshRecentPurchases = async (uid, setExpenseData, numEntries) => {
  const q = query(
    collection(db, "userPortfolios", uid, "Expenses"),
    orderBy("date", "desc"),
    limit(numEntries)
  );
  console.log(numEntries);
  const querySnapshot = await getDocs(q);
  const recentExpenses = querySnapshot.docs.map((docSnap) => ({
    docId: docSnap.id,
    img: "../../graphic/img/jomango.jpg",
    name: docSnap.data().note,
    location: docSnap.data().date.toDate().toLocaleDateString(),
    cost: docSnap.data().cash,
  }));
  setExpenseData(recentExpenses);
};

export default refreshRecentPurchases;
