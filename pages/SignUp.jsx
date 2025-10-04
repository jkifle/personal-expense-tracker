import { Link, Navigate } from "react-router-dom";
import React, { useState } from "react";
import { useAuth } from "../src/contexts/authContexts";
import { doCreateUserWithEmailAndPassword } from "../src/firebase/auth";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { userLoggedIn } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Email and password are required");
      return;
    }

    if (password != confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (!isRegistering) {
      try {
        setIsRegistering(true);
        await doCreateUserWithEmailAndPassword(email, password);
      } catch (error) {
        switch (error.code) {
          case "auth/email-already-in-use":
            setErrorMessage("Email already in use.");
            break;
          default:
            console.log(error);
        }
      }
    }
  };

  return (
    <>
      {userLoggedIn && <Navigate to={"/"} replace={true} />}
      <div className="p-3 max-w-lg mx-auto">
        <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/*       <input
          type="text"
          placeholder="Username"
          className="border p-3 rounded-lg"
          id="username"
        />*/}
          <input
            type="email"
            placeholder="Email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            className="border p-3 rounded-lg"
            id="email"
          />
          <input
            disabled={isRegistering}
            type="password"
            placeholder="Password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            className="border p-3 rounded-lg"
          />
          <>
            <label className="text-sm text-gray-600 font-bold">
              Confirm Password
            </label>
            <input
              disabled={isRegistering}
              placeholder="Password"
              type="password"
              autoComplete="off"
              required
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
              className="border p-3 rounded-lg"
            />
          </>

          {errorMessage && (
            <span className="text-red-600 font-bold">{errorMessage}</span>
          )}

          <button
            className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-0"
            type="submit"
            disabled={isRegistering}
          >
            {isRegistering ? "Loading..." : "Sign Up"}
          </button>

          <div className="flex gap-2 mt-5">
            <p>Have an account?</p>
            <Link to={"/sign-in"}>
              <span className="text-blue-700">Sign In</span>
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default SignUp;
