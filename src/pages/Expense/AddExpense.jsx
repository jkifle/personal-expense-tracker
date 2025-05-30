import React, { useState } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

const AddExpense = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [amountCash, setAmountCash] = useState("");
  const [startDate, setStartDate] = useState(new Date());

  const [purpose, setPurpose] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
    } catch (error) {
      switch (error.code) {
        case "auth/wrong-password":
          setErrorMessage("Incorrect password.");
          break;
        case "auth/user-not-found":
          setErrorMessage("User not found. Please sign up.");
          break;
        case "auth/invalid-credential":
          setErrorMessage("Incorrect email/password");
          break;
        default:
          console.log(error);
      }
      setIsSigningIn(false);
      return;
    }
    // insert doSendEmailVerification() if im tryna do 2 step no bot
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7 text-white">
        Add Expense
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="number"
          placeholder="Enter amount"
          className="border p-3 rounded-lg"
          id="amount"
          onChange={(e) => {
            setAmountCash(e.target.value);
          }}
        />
        <DatePicker
          className="border-1 rounded-lg p-3"
          selected={startDate}
          onChange={(date) => setStartDate(date)}
        />
        <button
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-0"
          onClick={handleSubmit}
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
