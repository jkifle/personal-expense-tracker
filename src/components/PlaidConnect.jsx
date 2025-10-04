import React, { useEffect, useState } from "react";
import axios from "axios";
import { usePlaidLink } from "react-plaid-link";

const PlaidConnect = () => {
  const [linkToken, setLinkToken] = useState(null);

  // 1. Request a link token from your backend
  useEffect(() => {
    const createLinkToken = async () => {
      try {
        const response = await axios.post("/api/create_link_token");
        setLinkToken(response.data.link_token);
      } catch (error) {
        console.error("Error creating link token:", error);
      }
    };

    createLinkToken();
  }, []);

  // 2. Define success handler when user links account
  const onSuccess = async (public_token, metadata) => {
    try {
      // send uid from your auth context
      const uid = currentUser.uid;

      await axios.post("/api/exchange_token", { public_token, uid });
      console.log("Public token exchanged");

      const response = await axios.get("/api/transactions", {
        params: { uid },
      });
      console.log("Transactions:", response.data);
    } catch (error) {
      console.error("Error in onSuccess:", error);
    }
  };

  // 5. Hook into Plaid Link with the token
  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: onSuccess,
  });

  return (
    <div className="">
      <button
        className="border flex justify-center bg-white rounded-lg p-1 w-1/8"
        onClick={() => open()}
        disabled={!ready}
      >
        <img
          className="w-2/3"
          src="/graphic/img/PlaidIcon.jpg"
          alt="Connect Your Bank with Plaid"
        />
      </button>
    </div>
  );
};

export default PlaidConnect;
