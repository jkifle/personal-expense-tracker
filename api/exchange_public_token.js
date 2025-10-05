// api/exchange_public_token.js
import { plaidClient, admin } from "./_init.js";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { public_token, uid } = req.body;
        if (!public_token || !uid) {
            return res.status(400).json({ error: "Missing public_token or uid" });
        }

        const exchangeResponse = await plaidClient.itemPublicTokenExchange({
            public_token,
        });

        const access_token = exchangeResponse.data.access_token;
        const item_id = exchangeResponse.data.item_id;

        // Store in Firestore
        await admin.firestore().collection("plaid_items").doc(uid).set({
            access_token,
            item_id,
            linkedAt: new Date().toISOString(),
        });

        console.log("Token exchange successful for user:", uid);
        res.status(200).json({ access_token, item_id });
    } catch (error) {
        console.error("Exchange token error:", error);
        res.status(500).json({ error: error.message });
    }
}
