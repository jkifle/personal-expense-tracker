// src/components/PlaidConnect.jsx
import React, { useState, useEffect } from "react";
import { usePlaidLink } from "react-plaid-link";
import axios from "axios";

export default function PlaidConnect({ uid, onSuccess }) {
  const [linkToken, setLinkToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE_URL = `${window.location.origin}/api`;

  // Fetch Plaid link token
  useEffect(() => {
    if (!uid) {
      console.warn(
        "UID not available yet, skipping Plaid link token creation."
      );
      return;
    }

    const createLinkToken = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.post(`${API_BASE_URL}/create_link_token`, {
          uid,
        });
        const token = response.data?.link_token;
        if (!token) throw new Error("Link token missing in response");
        console.log("Link token received:", token);
        setLinkToken(token);
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
        const exchangeRes = await axios.post(
          `${API_BASE_URL}/exchange_public_token`,
          {
            uid,
            public_token,
          }
        );

        const { access_token, item_id } = exchangeRes.data || {};
        if (!access_token) {
          console.error(
            "No access_token returned from backend:",
            exchangeRes.data
          );
        } else {
          console.log("Public token exchanged successfully:", {
            item_id,
            access_tokenPreview: access_token.slice(0, 6) + "...",
          });
        }

        // Fetch transactions safely
        const txResponse = await axios.get(
          `${API_BASE_URL}/plaid/transactions`,
          {
            params: { uid },
          }
        );

        const txData = txResponse.data;
        const transactions = Array.isArray(txData)
          ? txData
          : txData?.transactions || [];

        console.log(
          `Retrieved & stored ${transactions.length} transactions`,
          transactions.slice(0, 2) // Show sample
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
        disabled={!ready || !linkToken || loading}
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
