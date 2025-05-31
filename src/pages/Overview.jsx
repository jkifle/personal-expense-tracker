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
import Header from "../components/Header";

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
    <div>
      <div className="mt-3 border p-3 max-w-lg mx-auto rounded-lg l flex flex-col items-center justify-center bg-emerald-950">
        <div className="max-w-screen">
          <div className="p-3 text-lg">Spent this Month</div>
        </div>
        <div className="text-6xl text-center p-3 rounded-lg max-w-xs w-auto">
          {totalOut !== null ? `$${totalOut}` : "..."}
        </div>
        <Link to={"/add-expense"}>
          <ul className="border text-center p-2 rounded-lg max-w-3xs w-auto">
            Add
          </ul>
        </Link>
      </div>
      <div className="mt-3 border p-3 max-w-lg mx-auto rounded-lg l  bg-emerald-950">
        <div className="flex justify-between">
          <label className="p-2 text-lg ">Recent purchases</label>
          <Link to={"/purchase-history"}>
            <ul className="border text-center p-2 rounded-lg  w-auto">
              View All
            </ul>
          </Link>
        </div>
        {/* Purchase History */}
        <section className="mt-2 flex flex-col gap-2">
          <div class="grid grid-cols-3 items-baseline-last">
            <img className="w-15" src="../../graphic/img/jomango.jpg" />
            <div>
              <h4>Waffle House</h4>
              <p>Panama City, Florida</p>
            </div>
            <p>$0</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Manager;
