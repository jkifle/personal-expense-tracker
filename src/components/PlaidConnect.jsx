import React, { useEffect, useState } from "react";
import axios from "axios";
import { usePlaidLink } from "react-plaid-link";
import { useAuth } from "../contexts/authContexts"; // adjust path as needed
const PlaidConnect = () => {
  const { currentUser } = useAuth(); // Get authenticated user
  const [linkToken, setLinkToken] = useState(null);
  const [loading, setLoading] = useState(false);

  // 1️ Request a Plaid link token from backend
  useEffect(() => {
    if (!currentUser) return;

    const createLinkToken = async () => {
      try {
        setLoading(true);
        const response = await axios.post("/api/create_link_token", {
          uid: currentUser.uid,
        });
        setLinkToken(response.data.link_token);
      } catch (error) {
        console.error(
          "Error creating link token:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    createLinkToken();
  }, [currentUser]);

  // 2️ Handler when user successfully links a bank account
  const onSuccess = async (public_token, metadata) => {
    if (!currentUser) return;

    try {
      const uid = currentUser.uid;

      // Exchange public token for access token and store it in Firestore
      await axios.post("/api/exchange_token", { public_token, uid });
      console.log("Public token exchanged and stored for user:", uid);

      // Fetch recent transactions
      const response = await axios.get("/api/transactions", {
        params: { uid },
      });
      console.log("Transactions fetched:", response.data);

      // Optional: you could update a state to show transactions in UI
      // setTransactions(response.data);
    } catch (error) {
      console.error(
        "Error in onSuccess:",
        error.response?.data || error.message
      );
    }
  };

  // 3️ Hook into Plaid Link
  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess,
  });

  return (
    <div className="flex justify-center">
      <button
        className="border flex justify-center bg-white rounded-lg p-1 w-1/8"
        onClick={() => open()}
        disabled={!ready || loading}
      >
        {loading ? (
          "Loading..."
        ) : (
          <img
            className="w-2/3"
            src="/graphic/img/PlaidIcon.jpg"
            alt="Connect Your Bank with Plaid"
          />
        )}
      </button>
    </div>
  );
};

export default PlaidConnect;
