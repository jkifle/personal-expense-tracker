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
    if (req.method !== 'POST') return res.status(405).end();

    const { public_token, uid } = req.body;
    if (!public_token || !uid) return res.status(400).json({ error: 'Missing fields' });

    try {
        const response = await plaidClient.itemPublicTokenExchange({ public_token });
        const access_token = response.data.access_token;

        // Store in Firestore under userPortfolios/uid/plaidToken
        await DB.collection('userPortfolios').doc(uid).collection('plaidToken').doc('token').set({
            access_token,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to exchange token' });
    }
}
