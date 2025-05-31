import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContexts";
import { doSignOut } from "../firebase/auth.js";

const Header = () => {
  const navigate = useNavigate();
  const { userLoggedIn } = useAuth();

  return (
    <header className="shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold test-sm sm:test-xl flex flex-wrap gap-2">
            <span className="text-slate-500">Pocket </span>
            <span className="text-slate-700">Watch</span>
          </h1>
        </Link>
        <form className="bg-slate-100 p-3 rounded-lg flex items-center">
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
          />
          <FaSearch className="text-slate-500" />
        </form>
        <ul className="flex gap-4">
          <Link to="/">
            <li className="hidden sm:inline lin text-slate-700 hover:underline">
              Home
            </li>
          </Link>
          {userLoggedIn ? (
            <Link to="/overview">
              <li className="hidden sm:inline lin text-slate-700 hover:underline">
                Manager
              </li>
            </Link>
          ) : (
            <></>
          )}
          <Link to="/profile">
            {userLoggedIn ? (
              <img
                alt="profile"
                className="rounded-full h-7 w-7 object-cover"
              ></img>
            ) : (
              <li className="sm:inline lin text-white">Sign In</li>
            )}
          </Link>
          {userLoggedIn ? (
            <li>
              <button
                onClick={() => {
                  doSignOut().then(() => {
                    navigate("/sign-in");
                  });
                }}
              >
                Log out
              </button>
            </li>
          ) : (
            <></>
          )}
        </ul>
      </div>
    </header>
  );
};

export default Header;
