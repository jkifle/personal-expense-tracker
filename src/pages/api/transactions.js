import admin from 'firebase-admin';

// Prevent reinitialization of Firebase Admin SDK
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)),
    });
}

const db = admin.firestore();

// ✅ Helper to set CORS headers
function setCorsHeaders(res) {
    res.setHeader('Access-Control-Allow-Origin', '*'); // You can replace '*' with your frontend URL for security
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

export default async function handler(req, res) {
    // Apply CORS headers
    setCorsHeaders(res);

    // ✅ Handle preflight request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        if (req.method === 'GET') {
            const { uid } = req.query;

            if (!uid) {
                return res.status(400).json({ error: 'Missing user ID (uid)' });
            }

            const snapshot = await db
                .collection('transactions')
                .where('uid', '==', uid)
                .get();

            const transactions = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            return res.status(200).json({ transactions });
        }

        if (req.method === 'POST') {
            const { uid, transaction } = req.body;

            if (!uid || !transaction) {
                return res.status(400).json({ error: 'Missing uid or transaction data' });
            }

            const newDoc = await db.collection('transactions').add({
                uid,
                ...transaction,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
            });

            return res.status(201).json({ id: newDoc.id });
        }

        // Unsupported methods
        res.setHeader('Allow', ['GET', 'POST', 'OPTIONS']);
        return res.status(405).json({ error: `Method ${req.method} not allowed` });

    } catch (error) {
        console.error('🔥 Error in /api/transactions:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
