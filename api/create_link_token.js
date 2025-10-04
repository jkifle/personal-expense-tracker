import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";

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
        const response = await plaidClient.linkTokenCreate({
            user: { client_user_id: "test-user" },
            client_name: "Expense Tracker App",
            products: ["transactions"],
            language: "en",
            country_codes: ["US"],
        });

        return res.status(200).json(response.data);
    } catch (error) {
        console.error("Error creating link token:", error.response?.data || error.message);
        return res.status(500).json({ error: "Error creating link token" });
    }
}
