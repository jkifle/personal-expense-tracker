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

    try {
        const { public_token, uid } = req.body;

        if (!public_token || !uid) {
            return res.status(400).json({ error: "Missing public_token or uid" });
        }

        // Exchange public token for access token
        const exchangeResponse = await plaidClient.itemPublicTokenExchange({
            public_token,
        });

        const accessToken = exchangeResponse.data.access_token;

        // Store access token in Firestore at userPortfolios/{uid}/plaidToken/token
        await setDoc(
            doc(db, "userPortfolios", uid, "plaidToken", "token"),
            { accessToken, updatedAt: new Date() }
        );

        res.status(200).json({ message: "Access token stored" });
    } catch (error) {
        console.error("Exchange token error:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to exchange token" });
    }
}
