// src/components/PlaidConnect.jsx
import React, { useState, useEffect } from "react";
import { usePlaidLink } from "react-plaid-link";
import axios from "axios";

export default function PlaidConnect({ uid, onSuccess }) {
  const [linkToken, setLinkToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Determine API base URL dynamically
  const API_BASE_URL = `${window.location.origin}/api`;

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
        console.log("Link token received:", response.data.link_token);
        setLinkToken(response.data.link_token);
      } catch (err) {
        console.error("Error creating Plaid link token:", err);
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
        console.log("Exchanging public token...");
        await axios.post(`${API_BASE_URL}/exchange_public_token`, {
          uid,
          public_token,
        });
        console.log("Public token exchanged successfully");

        // Immediately fetch & store transactions from Plaid
        const txResponse = await axios.get(
          `${API_BASE_URL}/plaid/transactions`,
          {
            params: { uid },
          }
        );
        console.log(
          `Retrieved & stored ${txResponse.data.transactions.length} transactions`
        );

        if (onSuccess) onSuccess(metadata);
      } catch (err) {
        console.error("Error in Plaid connection flow:", err);
      }
    },
  });

  return (
    <div className="flex justify-left">
      <button
        onClick={() => open()}
        disabled={!ready || !linkToken}
        className="border flex justify-center bg-white rounded-lg p-1 w-1/8"
      >
        <img
          className="w-2/3"
          src="/graphic/img/PlaidIcon.jpg"
          alt="Connect Your Bank with Plaid"
        />
      </button>

      {error && <p style={{ color: "red", marginTop: 8 }}>{error}</p>}
    </div>
  );
}
