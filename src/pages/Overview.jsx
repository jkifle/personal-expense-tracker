import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Manager = () => {
  return (
    <div className="mt-3 p-3 max-w-lg mx-auto rounded-lg columns-2 bg-emerald-950">
      <div className="max-w-screen columns-2">
        <div className="p-3 text-lg">Spent this Month</div>
        <div className="p-3 text-lg">Spent this Month</div>
      </div>
      <div className="p-3 text-6xl">$0.00</div>
      <Link to={"/add-expense"}>
        <ul>Add</ul>
      </Link>
    </div>
  );
};

export default Manager;
