import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getDoc,
  setDoc,
  doc,
  collection,
  query,
  where,
  increment,
  updateDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "../src/firebase/firebase.js";
import { useAuth } from "../src/contexts/authContexts/index.jsx";
import ExpenseCard from "../src/components/ExpenseCard.jsx";
import refreshRecentPurchases from "../src/hooks/useRecentPurchases.jsx";
import { VscAdd } from "react-icons/vsc";
import PlaidConnect from "../src/components/PlaidConnect.jsx";
import fetchAndStoreTransactions from "../src/hooks/fetchAndStoreTransactions.js";
import MonthlyExpenseChart from "../src/components/MonthlyExpenseChart.jsx";

const Manager = () => {
  const { currentUser } = useAuth();
  const [uid, setUid] = useState(null);
  const [totalOut, setTotalOut] = useState(null);
  const [expenseData, setExpenseData] = useState([]);
  const [recentData, setRecentData] = useState([]);
  const entries = 3;
  const date = new Date();
  const monthYearKey = `${date.getMonth() + 1}-${date.getFullYear()}`;

  useEffect(() => {
    if (currentUser?.uid) {
      setUid(currentUser.uid);
    }
  }, [currentUser]);

  useEffect(() => {
    if (expenseData.length > 0) {
      const recent = expenseData.slice(0, 3);
      setRecentData(recent);
      console.log("Recent data sample:", recent);
    }
  }, [expenseData]);

  useEffect(() => {
    if (!uid) return;

    const initializeAndRefresh = async () => {
      try {
        const monthlyTotalDocRef = doc(
          db,
          "userPortfolios",
          uid,
          "monthlyTotals",
          monthYearKey
        );

        const docSnap = await getDoc(monthlyTotalDocRef);
        if (!docSnap.exists()) {
          await setDoc(monthlyTotalDocRef, {
            totalOut: 0,
            totalIn: 0,
            spendingRating: 0,
          });
          setTotalOut(0);
        } else {
          setTotalOut(docSnap.data().totalOut);
        }

        // Fetch/store transactions
        await fetchAndStoreTransactions(uid);

        // Refresh local state
        await refreshDataBase(uid, monthlyTotalDocRef);
        await refreshRecentPurchases(uid, setExpenseData, 100);
      } catch (err) {
        console.error("Error initializing dashboard:", err);
      }
    };

    initializeAndRefresh();
  }, [uid]);

  const refreshDataBase = async (uid, monthlyTotalDocRef) => {
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const startOfNextMonth = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      1
    );

    const q = query(
      collection(db, "userPortfolios", uid, "Expenses"),
      where("date", ">=", startOfMonth),
      where("date", "<", startOfNextMonth)
    );

    const querySnapshot = await getDocs(q);

    await updateDoc(monthlyTotalDocRef, { totalOut: 0 });

    for (const docSnap of querySnapshot.docs) {
      const data = docSnap.data();
      const amount = parseFloat(data.amount || 0);
      await updateDoc(monthlyTotalDocRef, {
        totalOut: increment(amount),
      });
    }

    const updatedSnap = await getDoc(monthlyTotalDocRef);
    setTotalOut(updatedSnap.data().totalOut);
  };

  const handleTransactions = (transactions) => {
    console.log("Fetched transactions:", transactions);
  };

  // ⏳ Wait for UID before rendering PlaidConnect or dashboard
  if (!uid) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-white">
        Loading user info...
      </div>
    );
  }

  return (
    <div>
      <section className="border p-3 max-w-4/6 mx-auto rounded-lg flex flex-col items-center bg-emerald-950">
        <label className="p-3 text-lg font-black">Spent this Month</label>

        <div className="p-2 text-6xl col-start-2 rounded-lg max-w-xs w-auto">
          {totalOut !== null ? `$${totalOut}` : "..."}
        </div>

        <div className="flex flex-row gap-3">
          <Link to={"/add-expense"}>
            <ul className="border w-auto text-center p-3 rounded-lg">
              <VscAdd />
            </ul>
          </Link>

          {/* ✅ Render PlaidConnect only when UID is ready */}
          <PlaidConnect uid={uid} onSuccessTransactions={handleTransactions} />
        </div>
      </section>

      {/* Purchase History */}
      <section className="mt-3 border p-3 max-w-4/6 mx-auto rounded-lg bg-emerald-950">
        <div className="flex justify-between">
          <label className="p-2 text-lg font-black">Recent Purchases</label>
          <Link to={"/expense-history"}>
            <ul className="border text-center p-2 rounded-lg w-auto">
              View All
            </ul>
          </Link>
        </div>

        <div className="mt-2 flex flex-col gap-2">
          {recentData.map((receipt, index) => (
            <ExpenseCard
              key={index}
              docId={receipt.docId}
              img={receipt.img}
              name={receipt.name}
              category={receipt.category}
              amount={receipt.amount}
              date={receipt.date}
              onDelete={() =>
                refreshRecentPurchases(uid, setExpenseData, entries)
              }
            />
          ))}
        </div>
      </section>

      {/* Chart Display */}
      <section className="mt-3 border p-3 max-w-4/6 mx-auto rounded-lg bg-emerald-950">
        <div className="flex justify-between">
          <label className="p-2 text-lg font-black">Monthly Spent</label>
          <Link to={"/expense-history"}>
            <ul className="border text-center p-2 rounded-lg w-auto">
              View All
            </ul>
          </Link>
        </div>

        <div className="mt-2 flex justify-center">
          <MonthlyExpenseChart expenses={expenseData} />
        </div>
      </section>
    </div>
  );
};

export default Manager;
