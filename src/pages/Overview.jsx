import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { db } from "../firebase/firebase";
import { useAuth } from "../contexts/authContexts";

const Manager = () => {
  const { currentUser } = useAuth();
  const uid = currentUser.uid;
  const date = new Date();
  const monthYearKey = `${date.getMonth() + 1}-${date.getFullYear()}`;
  const [totalOut, setTotalOut] = useState(null);
  const monthlyTotalDocRef = doc(
    db,
    "userPortfolios",
    uid,
    "monthlyTotals",
    monthYearKey
  );

  useEffect(() => {
    const initializeAndRefresh = async () => {
      if (!uid) return;

      const docSnap = await getDoc(monthlyTotalDocRef);

      if (!docSnap.exists()) {
        await setDoc(monthlyTotalDocRef, {
          totalOut: 0,
          totalIn: 0,
          spendingRating: 0,
        });
        setTotalOut(0);
        console.log("Initilized monthly total");
      } else {
        const data = docSnap.data();
        setTotalOut(data.totalOut);
      }

      // Auto-refresh calculation on load
      await refreshDataBase();
    };

    initializeAndRefresh();
  }, [uid]);

  const refreshDataBase = async () => {
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const startOfNextMonth = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      1
    );
    console.log(startOfMonth + "  " + startOfNextMonth);
    const q = query(
      collection(db, "userPortfolios", uid, "Expenses"),
      where("date", ">=", startOfMonth),
      where("date", "<", startOfNextMonth)
    );

    const querySnapshot = await getDocs(q);

    // Reset totalOut before summing up again
    await updateDoc(monthlyTotalDocRef, { totalOut: 0 });

    for (const docSnap of querySnapshot.docs) {
      const data = docSnap.data();
      const amount = parseFloat(data.cash || 0);
      await updateDoc(monthlyTotalDocRef, {
        totalOut: increment(data.cash),
      });
    }
    // Re-fetch to reflect updated total
    const updatedSnap = await getDoc(monthlyTotalDocRef);
    setTotalOut(updatedSnap.data().totalOut);
  };

  return (
    <div className="mt-3 p-3 max-w-lg mx-auto rounded-lg columns-2 bg-emerald-950">
      <div className="max-w-screen columns-1">
        <div className="p-3 text-lg">Spent this Month</div>
      </div>
      <div className="p-3 text-6xl">
        {totalOut !== null ? `$${totalOut}` : "..."}
      </div>
      <Link to={"/add-expense"}>
        <ul>Add</ul>
      </Link>
    </div>
  );
};

export default Manager;
