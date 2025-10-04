import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../src/firebase/firebase";

const config = new Configuration({
    basePath: PlaidEnvironments[process.env.PLAID_ENV],
    baseOptions: {
        headers: {
            "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
            "PLAID-SECRET": process.env.PLAID_SECRET,
        },
    },
});

const plaidClient = new PlaidApi(config);

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).end();

    const { public_token, uid } = req.body;

    if (!public_token || !uid) return res.status(400).json({ error: "Missing public_token or uid" });

    try {
        const tokenResponse = await plaidClient.itemPublicTokenExchange({ public_token });
        const accessToken = tokenResponse.data.access_token;

        // Save accessToken to Firestore for this user
        await setDoc(doc(db, "plaidTokens", uid), { accessToken });

        return res.status(200).json({ message: "Access token stored", accessToken });
    } catch (error) {
        console.error("Error exchanging public token:", error.response?.data || error.message);
        return res.status(500).json({ error: "Failed to exchange public token" });
    }
}
