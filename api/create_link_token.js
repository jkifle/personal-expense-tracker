import { plaidClient } from "./_init.js";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { uid } = req.body;
    if (!uid) return res.status(400).json({ error: "Missing UID" });

    try {
        const response = await plaidClient.linkTokenCreate({
            user: { client_user_id: uid },
            client_name: "My Expense Tracker",
            products: ["transactions"],
            country_codes: ["US"],
            language: "en",
        });

        res.status(200).json({ link_token: response.data.link_token });
    } catch (err) {
        console.error("❌ Plaid link token error:", err.response?.data || err);
        res.status(500).json({ error: "Failed to create link token" });
    }
}
