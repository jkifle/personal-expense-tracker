import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';

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

// Demo only — you should store per-user tokens
let accessToken = null;

export default async function handler(req, res) {
    if (req.method !== 'GET') return res.status(405).end();

    try {
        if (!accessToken) {
            return res.status(400).json({ error: "No access token — link a bank first." });
        }

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
        console.error("🔥 Error in /transactions:", error.response?.data || error.message);
        res.status(500).json({ error: "Error fetching transactions" });
    }
}
