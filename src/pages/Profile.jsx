import { useSelector } from "react-redux";
import { useAuth } from "../contexts/authContexts";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  increment,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

import "react-datepicker/dist/react-datepicker.css";

const Profile = () => {
  const { currentUser } = useAuth();
  const [errorMessage, setErrorMessage] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [changedEmail, setChangedEmail] = useState("");
  const [changedPassword, setChangedPassword] = useState("");
  const [image, setImage] = useState("");

  const handleUpdate = async (e) => {
    e.preventDefault();

    const nameDocRef = await doc(
      db,
      "userPortfolios",
      currentUser.uid,
      "Settings",
      "userInfo"
    );
    try {
      await updateDoc(nameDocRef, {
        firstName: firstName,
        lastName: lastName,
      });
    } catch (updateError) {
      await setDoc(nameDocRef, {
        firstName: firstName,
        lastName: lastName,
      });
    }
    console.log("Update profile");
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleUpdate} className="flex flex-col gap-4">
        <img
          // src={currentUser.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />
        <div className="flex justify-between">
          <input
            type="text"
            placeholder="First name"
            //  defaultValue={currentUser.username}
            className="w-auto border p-3 rounded-lg"
            id="firstname"
            onChange={(e) => {
              setFirstName(e.target.value);
            }}
          ></input>
          <input
            type="text"
            placeholder="Last name"
            //  defaultValue={currentUser.username}
            className="w-auto border p-3 rounded-lg"
            id="lastname"
            onChange={(e) => {
              setLastName(e.target.value);
            }}
          ></input>
        </div>

        <input
          type="text"
          placeholder="email"
          defaultValue={currentUser.email}
          className="border p-3 rounded-lg"
          id="email"
        ></input>

        <button
          type="submit"
          className="bg-slate-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
        >
          Update
        </button>
      </form>
      <div className="flex flex-row justify-center gap-4 mt-4">
        <span className="rounded-lg bg-slate-600 text-white cursor-pointer p-2">
          Sign Out
        </span>
        <span className="text-red-300 rounded-lg bg-slate-600 cursor-pointer p-2">
          Delete account
        </span>
      </div>
    </div>
  );
};

export default Profile;
