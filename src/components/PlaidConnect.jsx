import { useEffect, useState } from "react";
import { usePlaidLink } from "react-plaid-link";
import axios from "axios";

export default function PlaidConnect({ onSuccessTransactions }) {
  const [linkToken, setLinkToken] = useState(null);

  useEffect(() => {
    const createLinkToken = async () => {
      const res = await axios.post("http://localhost:8000/create_link_token");
      setLinkToken(res.data.link_token);
    };
    createLinkToken();
  }, []);

  const onSuccess = async (public_token) => {
    await axios.post("http://localhost:8000/exchange_token", { public_token });
    const response = await axios.get("http://localhost:8000/transactions");
    onSuccessTransactions(response.data);
  };

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess,
  });

  return (
    <button
      className="mt-3 p-2 border rounded-lg"
      onClick={() => open()}
      disabled={!ready}
    >
      Connect Bank Account
    </button>
  );
}
