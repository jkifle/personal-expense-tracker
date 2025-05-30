import { Link, Navigate } from "react-router-dom";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import { useAuth } from "../contexts/authContexts";
import {
  doSignInWithGoogle,
  doSignInWithEmailAndPassword,
} from "../firebase/auth";

const Login = () => {
  const { userLoggedIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isSigningIn) {
      try {
        setIsSigningIn(true);
        await doSignInWithEmailAndPassword(email, password);
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
    }
  };
  const onGoogleSignIn = (e) => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      doSignInWithGoogle().catch((err) => {
        setIsSigningIn(false);
        alert(err.errorMessage);
      });
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      {userLoggedIn && <Navigate to={"/"} replace={true} />}
      <h1 className="text-3xl text-center font-semibold my-7 text-white">
        Sign In
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          className="border p-3 rounded-lg"
          id="email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-3 rounded-lg"
          value={password}
          id="password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <button
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-0"
          onClick={handleSubmit}
        >
          {isSigningIn ? "Signing In..." : "Log in"}
        </button>
        <button
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-0"
          onClick={onGoogleSignIn}
        >
          {"Sign in with Google"}
        </button>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Don't have an account?</p>
        <Link to={"/sign-up"}>
          <span className="text-blue-300">Sign Up</span>
        </Link>
      </div>
      {errorMessage && (
        <span className="text-red-600 font-bold">{errorMessage}</span>
      )}
    </div>
  );
};

export default Login;
