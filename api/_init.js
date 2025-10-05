// api/_init.js
import admin from "firebase-admin";
import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";

// --- Initialize Firebase Admin ---
if (!admin.apps.length) {
    try {
        const projectId = process.env.FIREBASE_PROJECT_ID;
        const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
        const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

        if (!projectId || !clientEmail || !privateKey) {
            throw new Error("Missing one or more Firebase environment variables");
        }

        admin.initializeApp({
            credential: admin.credential.cert({
                projectId,
                clientEmail,
                privateKey,
            }),
        });

        console.log("🔥 Firebase Admin initialized successfully");
    } catch (error) {
        console.error("❌ Firebase initialization failed:", error);
    }
}

// --- Initialize Plaid Client ---
const plaidConfig = new Configuration({
    basePath: PlaidEnvironments.sandbox,
    baseOptions: {
        headers: {
            "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
            "PLAID-SECRET": process.env.PLAID_SECRET,
        },
    },
});

const plaidClient = new PlaidApi(plaidConfig);

export { admin, plaidClient };
