import { admin, plaidClient } from "./_init.js";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { uid, public_token } = req.body;
    if (!uid || !public_token) {
        return res.status(400).json({ error: "Missing UID or public_token" });
    }

    try {
        const exchangeResponse = await plaidClient.itemPublicTokenExchange({
            public_token,
        });

        const access_token = exchangeResponse.data.access_token;
        const item_id = exchangeResponse.data.item_id;

        const userRef = admin.firestore().collection("userPortfolios").doc(uid);
        await userRef.set(
            {
                plaid: {
                    access_token,
                    item_id,
                    lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
                },
            },
            { merge: true }
        );

        console.log(`✅ Stored Plaid access_token for UID: ${uid}`);
        res.status(200).json({ success: true });
    } catch (err) {
        console.error("🚨 Exchange token error:", err.response?.data || err);
        res.status(500).json({ error: "Failed to exchange public token" });
    }
}
