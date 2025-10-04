import { DB } from "../../../lib/firebaseAdmin";
import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';

const plaidClient = new PlaidApi(
    new Configuration({
        basePath: PlaidEnvironments[process.env.PLAID_ENV],
        baseOptions: {
            headers: {
                'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
                'PLAID-SECRET': process.env.PLAID_SECRET,
            },
        },
    })
);

export default async function handler(req, res) {
    if (req.method !== 'GET') return res.status(405).end();

    const uid = req.query.uid;
    if (!uid) return res.status(400).json({ error: 'Missing UID' });

    try {
        // Retrieve access token from Firestore
        const tokenDoc = await DB
            .collection('userPortfolios')
            .doc(uid)
            .collection('plaidToken')
            .doc('token')
            .get();

        if (!tokenDoc.exists) return res.status(404).json({ error: 'No token found' });

        const access_token = tokenDoc.data().access_token;

        // Fetch transactions from Plaid
        const response = await plaidClient.transactionsGet({
            access_token,
            start_date: '2025-01-01', // adjust date range
            end_date: '2025-12-31',
        });

        res.status(200).json(response.data.transactions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'A server error has occurred' });
    }
}
