// src/components/PlaidConnect.jsx
import React, { useState, useEffect } from "react";
import { usePlaidLink } from "react-plaid-link";
import axios from "axios";

export default function PlaidConnect({ uid, onSuccess }) {
  const [linkToken, setLinkToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Determine API base URL dynamically
  const isLocal = window?.location?.hostname === "localhost";
  const API_BASE_URL = isLocal
    ? "http://localhost:3000/api"
    : "https://personal-expense-tracker-4rirpazjl-jkifles-projects.vercel.app/api";

  // Fetch link token when UID is available
  useEffect(() => {
    if (!uid) {
      console.warn("UID not available yet, cannot create Plaid link token.");
      return;
    }

    const createLinkToken = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.post(`${API_BASE_URL}/create_link_token`, {
          uid,
        });
        console.log("✅ Link token received:", response.data.link_token);
        setLinkToken(response.data.link_token);
      } catch (err) {
        console.error("❌ Error creating Plaid link token:", err);
        setError("Failed to create link token");
      } finally {
        setLoading(false);
      }
    };

    createLinkToken();
  }, [uid, API_BASE_URL]);

  // Initialize Plaid Link
  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: async (public_token, metadata) => {
      try {
        await axios.post(`${API_BASE_URL}/exchange_public_token`, {
          uid,
          public_token,
        });
        console.log("✅ Plaid public token exchanged successfully");
        if (onSuccess) onSuccess(metadata);
      } catch (err) {
        console.error("🚨 Error exchanging public token:", err);
        setError("Failed to exchange public token");
      }
    },
  });

  return (
    <div>
      <button onClick={() => open()} disabled={!ready || !linkToken || loading}>
        {loading ? "Loading..." : "Connect Bank Account"}
      </button>
      {error && <p style={{ color: "red", marginTop: 8 }}>{error}</p>}
    </div>
  );
}
