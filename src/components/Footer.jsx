import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContexts";
import { doSignOut } from "../firebase/auth.js";

const Footer = () => {
  const navigate = useNavigate();
  const { userLoggedIn } = useAuth();

  return (
    <footer className="shadow-md ">
      <div className="justify-between items-center max-w-6xl mx-auto p-3">
        <h1 className="font-bold test-sm sm:test-xl flex flex-wrap gap-2">
          <span className="text-slate-500">Personal </span>
          <span className="text-slate-700">Expense Tracker</span>
        </h1>
      </div>
    </footer>
  );
};

export default Footer;
