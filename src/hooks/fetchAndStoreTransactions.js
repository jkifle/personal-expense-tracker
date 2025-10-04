// src/hooks/fetchAndStoreTransactions.js

export default async function fetchAndStoreTransactions(uid) {
  if (!uid) {
    console.error("🚨 Missing UID for fetching transactions.");
    return [];
  }

  // Dynamically detect environment
  const isLocal = window?.location?.hostname === "localhost";

  // ✅ Use relative path in production to avoid CORS issues
  const API_BASE_URL = isLocal
    ? "http://localhost:5173/api" // local dev backend
    : "/api"; // same origin on Vercel deployment

  try {
    const url = `${API_BASE_URL}/transactions?uid=${uid}`;
    console.log(`📡 Fetching transactions from: ${url}`);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const text = await response.text();
      console.error(`❌ Fetch failed (${response.status}): ${text}`);
      throw new Error(`Fetch error ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ Transactions successfully fetched:", data);
    return data.transactions || [];
  } catch (error) {
    console.error("🚨 Error fetching/storing transactions:", error);
    return [];
  }
}
