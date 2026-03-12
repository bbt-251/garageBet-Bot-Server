import admin from 'firebase-admin';
import type { ServiceAccount } from 'firebase-admin'

interface ExtendedServiceAccount extends ServiceAccount {
    [key: string]: any // eslint-disable-line @typescript-eslint/no-explicit-any
}

interface FirebaseConfig {
    projectId: string
    config: ExtendedServiceAccount
    name: string
}

// External app configuration
const firebaseConfig = {
    garagebet: {
        apiKey: "AIzaSyD6sX5SllclS1dvGABLZd1EFbuV74wMIDM",
        authDomain: "garagebet-fa254.firebaseapp.com",
        projectId: "garagebet-fa254",
        storageBucket: "garagebet-fa254.firebasestorage.app",
        messagingSenderId: "271964121865",
        appId: "1:271964121865:web:7c9dae3e14792d1cb7c1d8",
        adminEnvKey: "NEXT_PUBLIC_FIREBASE_ADMIN_GARAGEBET",
        domain: "https://garagebet-mini-app.vercel.app/"
    }
}

// Dynamic external app configuration based on environment
export function getExternalAppConfig(): typeof firebaseConfig.garagebet {
    return firebaseConfig.garagebet
}

const prefixes = ['GARAGEBET']
const dbInstances: Record<string, any> = {}
const firebaseConfigs: Record<string, FirebaseConfig> = {}

prefixes.forEach(prefix => {
    const envVar = `NEXT_PUBLIC_FIREBASE_ADMIN_${prefix}`
    if (process.env[envVar]) {
        try {
            const config: ExtendedServiceAccount = JSON.parse(process.env[envVar]!)
            const name = prefix.toLowerCase()
            const appName = `app-${name}`
            firebaseConfigs[name] = {
                projectId: config.project_id!,
                config,
                name
            }

            if (admin) {
                let app;
                if (admin.apps.some(existingApp => existingApp !== null && existingApp.name === appName)) {
                    app = admin.app(appName);
                } else {
                    app = admin.initializeApp({
                        credential: admin.credential.cert(config)
                    }, appName);
                }
                const firestoreDb = admin.firestore(app);
                dbInstances[name] = firestoreDb;
            }
        } catch (error) {
            console.error(`Failed to initialize Firebase for ${prefix}:`, error);
        }
    }
})

export async function getHealthyDbInstances(): Promise<Record<string, admin.firestore.Firestore>> {
    return dbInstances;
}

export async function retryDatabaseOperation<T>(
    operation: () => Promise<T>,
    maxRetries: number = 2,
    baseDelay: number = 1000
): Promise<T> {
    let lastError: any;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await operation();
        } catch (error) {
            lastError = error;
            if (attempt === maxRetries) throw lastError;
            const delay = baseDelay * Math.pow(2, attempt - 1);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    throw lastError;
}

export { dbInstances, firebaseConfigs, firebaseConfig }
