// src/components/PlaidConnect.jsx
import React, { useState, useEffect } from "react";
import { usePlaidLink } from "react-plaid-link";
import axios from "axios";

export default function PlaidConnect({ uid, onSuccess }) {
  const [linkToken, setLinkToken] = useState(null);

  // Dynamically determine API base URL
  const isLocal = window?.location?.hostname === "localhost";
  const API_BASE_URL = isLocal
    ? "http://localhost:3000/api"
    : "https://personal-expense-tracker-4rirpazjl-jkifles-projects.vercel.app/api";

  useEffect(() => {
    const createLinkToken = async () => {
      try {
        const response = await axios.post(`${API_BASE_URL}/create_link_token`, {
          uid,
        });
        setLinkToken(response.data.link_token);
      } catch (err) {
        console.error("❌ Error creating Plaid link token:", err);
      }
    };

    if (uid) createLinkToken();
  }, [uid]);

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: async (public_token, metadata) => {
      try {
        // Exchange the public_token for an access_token
        await axios.post(`${API_BASE_URL}/exchange_public_token`, {
          uid,
          public_token,
        });
        console.log("✅ Plaid public token exchanged successfully");
        if (onSuccess) onSuccess(metadata);
      } catch (err) {
        console.error("🚨 Error exchanging public token:", err);
      }
    },
  });

  return (
    <button onClick={() => open()} disabled={!ready || !linkToken}>
      Connect Bank Account
    </button>
  );
}
