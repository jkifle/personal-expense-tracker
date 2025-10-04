import React, { useState } from "react";
import DatePicker from "react-datepicker";
import {
  collection,
  addDoc,
  getFirestore,
  updateDoc,
  doc,
  increment,
  setDoc,
} from "firebase/firestore";
import { db } from "../../src/firebase/firebase";
import { useAuth } from "../../src/contexts/authContexts";

import "react-datepicker/dist/react-datepicker.css";

const AddExpense = () => {
  const { currentUser } = useAuth();
  const [errorMessage, setErrorMessage] = useState("");
  const [amountCash, setAmountCash] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const monthYearKey = `${
      startDate.getMonth() + 1
    }-${startDate.getFullYear()}`;

    try {
      const docRef = await addDoc(
        collection(db, "userPortfolios", currentUser.uid, "Expenses"),
        {
          amount: parseFloat(amountCash),
          date: startDate,
          name: name,
          category: category,
          createdAt: new Date(),
        }
      );
      console.log("Expense added with ID:", docRef.id);
      const monthlyTotalDocRef = await doc(
        db,
        "userPortfolios",
        currentUser.uid,
        "monthlyTotals",
        monthYearKey
      );
      // Update the monthly total
      try {
        await updateDoc(monthlyTotalDocRef, {
          totalOut: increment(parseFloat(amountCash)),
        });
      } catch (updateError) {
        console.log("Creating new monthlyTotals doc...");
        await setDoc(monthlyTotalDocRef, {
          totalOut: parseFloat(amountCash),
          totalIn: 0,
          spendingRating: 0,
        });
      }

      setAmountCash("");
      setNote("");
      setName("");
      setStartDate(new Date());
      setCategory("");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7 text-white">
        Add Expense
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="number"
          value={amountCash}
          placeholder="$ Enter amount"
          className="border p-3 rounded-lg"
          required
          id="amount"
          onChange={(e) => {
            setAmountCash(e.target.value);
          }}
        />
        <div className="flex justify-between">
          <DatePicker
            className="border-1 rounded-lg p-3"
            required
            selected={startDate}
            value={startDate}
            onChange={(date) => setStartDate(date)}
          />
          <input
            type="text"
            placeholder="Vendor name"
            className="border p-3 rounded-lg w-43 lg:w-3xs md:w-3xs"
            id="name"
            value={name}
            required
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </div>
        <div className="flex justify-between">
          <input
            type="text"
            placeholder="Category"
            className="border p-3 rounded-lg lg:w-auto md:w-auto"
            id="category"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Note (optional)"
            className="border p-3 rounded-lg w-43 lg:w-3xs md:w-3xs"
            id="note"
            value={note}
            onChange={(e) => {
              setNote(e.target.value);
            }}
          />
        </div>
        <button
          type="submit"
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-0"
        >
          Add
        </button>
      </form>

      {errorMessage && (
        <span className="text-red-600 font-bold">{errorMessage}</span>
      )}
    </div>
  );
};
export default AddExpense;
