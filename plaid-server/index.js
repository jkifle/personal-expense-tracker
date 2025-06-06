// index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

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

let accessToken = null;

app.post('/create_link_token', async (req, res) => {
    try {
        const response = await plaidClient.linkTokenCreate({
            user: { client_user_id: 'test-user' },
            client_name: 'Expense Tracker App',
            products: ['transactions'],
            language: 'en',
            country_codes: ['US'],
        });
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating link token');
    }
});

app.post('/exchange_token', async (req, res) => {
    try {
        const { public_token } = req.body;
        const tokenResponse = await plaidClient.itemPublicTokenExchange({ public_token });
        accessToken = tokenResponse.data.access_token;
        res.json({ access_token: accessToken });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error exchanging token');
    }
});

app.get('/transactions', async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - 30);
        const thirtyDaysAgo = pastDate.toISOString().split('T')[0];

        const txns = await plaidClient.transactionsGet({
            access_token,
            start_date: thirtyDaysAgo,
            end_date: today,
        });

        res.json(txns.data.transactions);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching transactions');
    }
});

app.listen(8000, () => {
    console.log('Plaid server running on http://localhost:8000');
});
