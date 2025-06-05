import React, { useEffect, useState } from "react";
import ExpenseCard from "../../components/ExpenseCard";
import { useAuth } from "../../contexts/authContexts";
import refreshRecentPurchases from "../../hooks/useRecentPurchases";
const ExpenseHistory = () => {
  const { currentUser } = useAuth();
  const uid = currentUser.uid;
  const [expenseData, setExpenseData] = useState([]);
  useEffect(() => {
    const initializeAndRefresh = async () => {
      if (!uid) return;

      await refreshRecentPurchases(uid, setExpenseData, 2);
    };
    initializeAndRefresh();
  }, [uid]);
  return (
    <div className="mt-3 border p-3 max-w-lg mx-auto rounded-lg l  bg-emerald-950">
      <div className="flex justify-between">
        <label className="p-2 text-lg ">Purchase History</label>
      </div>
      {/* Purchase History */}
      <section className="mt-2 flex flex-col gap-2">
        {expenseData.map((receipt, index) => (
          <ExpenseCard
            key={index}
            img={receipt.img}
            name={receipt.name}
            location={receipt.location}
            cost={receipt.cost}
          />
        ))}
      </section>
    </div>
  );
};

export default ExpenseHistory;
