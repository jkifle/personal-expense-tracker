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

    const { uid } = req.body;
    if (!uid) return res.status(400).json({ error: 'Missing UID' });

    try {
        const response = await plaidClient.linkTokenCreate({
            user: { client_user_id: uid },
            client_name: 'Expense Tracker App',
            products: ['transactions'],
            language: 'en',
            country_codes: ['US'],
        });
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error creating link token:', error.response?.data || error);
        res.status(500).json({ error: 'Failed to create link token' });
    }
}
