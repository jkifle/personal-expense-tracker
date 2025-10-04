import React, { useEffect, useState } from "react";
import axios from "axios";
import { usePlaidLink } from "react-plaid-link";
import { useAuth } from "../contexts/authContexts";

export default function PlaidConnect() {
  const { currentUser } = useAuth();
  const [linkToken, setLinkToken] = useState(null);

  useEffect(() => {
    if (!currentUser) return;

    const createLinkToken = async () => {
      try {
        const res = await axios.post("/api/create_link_token", {
          uid: currentUser.uid,
        });
        setLinkToken(res.data.link_token);
      } catch (err) {
        console.error("Error creating link token:", err);
      }
    };

    createLinkToken();
  }, [currentUser]);

  const onSuccess = async (public_token) => {
    if (!currentUser) return;

    try {
      const uid = currentUser.uid;

      await axios.post("/api/exchange_token", { public_token, uid });
      console.log("Token exchanged for UID:", uid);

      const txns = await axios.get("/api/transactions", { params: { uid } });
      console.log("Fetched transactions:", txns.data);
    } catch (err) {
      console.error("Error in onSuccess:", err.response?.data || err.message);
    }
  };

  const { open, ready } = usePlaidLink({ token: linkToken, onSuccess });

  return (
    <button
      onClick={() => open()}
      disabled={!ready}
      className="border p-2 rounded bg-white"
    >
      Connect Your Bank
    </button>
  );
}
