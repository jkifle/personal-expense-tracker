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

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    try {
        const { public_token } = req.body;
        const tokenResponse = await plaidClient.itemPublicTokenExchange({ public_token });
        const accessToken = tokenResponse.data.access_token;

        res.status(200).json({ access_token: accessToken });
    } catch (error) {
        console.error("Exchange error:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to exchange public token" });
    }
}
