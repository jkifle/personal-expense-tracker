import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid/dist';

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
    res.setHeader("Access-Control-Allow-Origin", `${window.location.origin}`);
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    // Handle preflight (OPTIONS)
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const linkTokenResponse = await plaidClient.linkTokenCreate({
            user: { client_user_id: req.body.uid },
            client_name: "Expense Tracker App",
            products: ["transactions"],
            language: "en",
            country_codes: ["US"],
        });
        res.status(200).json(linkTokenResponse.data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create link token" });
    }
}
