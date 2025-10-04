import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/firebase";

const config = new Configuration({
    basePath: PlaidEnvironments[process.env.PLAID_ENV],
    baseOptions: {
        headers: {
            'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
            'PLAID-SECRET': process.env.PLAID_SECRET,
        },
    },
});
const plaidClient = new PlaidApi(config);

export default async function handler(req, res) {
    if (req.method !== 'GET') return res.status(405).end();

    try {
        const { uid } = req.query; // user ID from frontend

        const tokenDoc = await getDoc(doc(db, "plaidTokens", uid));
        if (!tokenDoc.exists()) {
            return res.status(400).json({ error: "No access token found for this user." });
        }

        const accessToken = tokenDoc.data().accessToken;

        const today = new Date().toISOString().split("T")[0];
        const past = new Date();
        past.setDate(past.getDate() - 30);
        const thirtyDaysAgo = past.toISOString().split("T")[0];

        const txns = await plaidClient.transactionsGet({
            access_token: accessToken,
            start_date: thirtyDaysAgo,
            end_date: today,
        });

        res.status(200).json(txns.data.transactions);
    } catch (error) {
        console.error("Error fetching transactions:", error.response?.data || error.message);
        res.status(500).json({ error: "Error fetching transactions" });
    }
}
