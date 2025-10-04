import React, { useEffect, useState } from "react";
import ExpenseCard from "../../src/components/ExpenseCard";
import { useAuth } from "../../src/contexts/authContexts";
import refreshRecentPurchases from "../../src/hooks/useRecentPurchases";
const ExpenseHistory = () => {
  const { currentUser } = useAuth();
  const uid = currentUser.uid;
  const [expenseData, setExpenseData] = useState([]);
  const entries = 50;
  useEffect(() => {
    const initializeAndRefresh = async () => {
      if (!uid) return;

      await refreshRecentPurchases(uid, setExpenseData, entries);
    };
    initializeAndRefresh();
  }, [uid]);
  return (
    <div className="mt-3 mb-5 border p-3 max-w-4/6 mx-auto rounded-lg l  bg-emerald-950">
      <div className="flex justify-between">
        <label className="p-2 text-lg ">Purchase History</label>
      </div>
      {/* Purchase History */}
      <section className="mt-2 flex flex-col gap-2">
        {expenseData.map((receipt, index) => (
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
      </section>
    </div>
  );
};

export default ExpenseHistory;
