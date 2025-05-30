import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { collection, addDoc, getFirestore } from "firebase/firestore";
import { db } from "../../firebase/firebase";

import "react-datepicker/dist/react-datepicker.css";

const AddExpense = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [amountCash, setAmountCash] = useState(new Number());
  const [startDate, setStartDate] = useState(new Date());
  const [purpose, setPurpose] = useState("");
  const [note, setNote] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, "userPortfolio"), {
        cash: amountCash,
        purpose: "Investment Purchase",
      });
      setAmountCash(new Number());
      setPurpose("");
      setStartDate(new Date());
      setNote("");

      console.log("Document written with ID: ", docRef.id);
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
            placeholder="Enter note (optional)"
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
