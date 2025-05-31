import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getDoc, setDoc, doc, collection } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "../contexts/authContexts";

const Manager = () => {
  const { currentUser } = useAuth();
  const uid = currentUser.uid;
  const date = new Date();
  const monthYearKey = `${date.getMonth() + 1}-${date.getFullYear()}`;
  const [totalOut, setTotalOut] = useState(null);

  useEffect(() => {
    const loadPage = async () => {
      if (!currentUser?.uid) return;
      const uid = currentUser.uid;
      const date = new Date();
      const monthYearKey = `${date.getMonth() + 1}-${date.getFullYear()}`;

      const monthlyTotalDocRef = doc(
        db,
        "userPortfolios",
        uid,
        "monthlyTotals",
        monthYearKey
      );

      const docSnap = await getDoc(monthlyTotalDocRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setTotalOut(data.totalOut);
      } else {
        // Create document if it doesn't exist
        await setDoc(monthlyTotalDocRef, {
          totalOut: 0,
          totalIn: 0,
          spendingRating: 0,
        });
        setTotalOut(0);
      }
    };

    loadPage();
  }, [currentUser]);

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
