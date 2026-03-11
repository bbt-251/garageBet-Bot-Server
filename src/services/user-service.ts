import { getHealthyDbInstances, retryDatabaseOperation } from '../firebase-config';
import { UserModel } from '../models/user';

/**
 * Find user by phone number
 */
export async function findUserByPhoneNumber(
    phoneNumber: string
): Promise<{ user: UserModel; projectName: string } | null> {
    const healthyDbs = await getHealthyDbInstances();
    console.log(`Searching for user with phone ${phoneNumber} across ${Object.keys(healthyDbs).length} Firebase projects`);

    for (const [projectName, db] of Object.entries(healthyDbs)) {
        try {
            const usersRef = db.collection('users');
            const query = await retryDatabaseOperation(async () => {
                return await usersRef
                    .where('phone', '==', phoneNumber)
                    .limit(1)
                    .get();
            }, 2, 1000);

            if (!query.empty) {
                const doc = query.docs[0];
                if (doc && doc.exists) {
                    const user = { id: doc.id, uid: doc.data().uid, ...doc.data() } as UserModel;
                    console.log(`Found user ${user.id} (UID: ${user.uid}) in project ${projectName}`);
                    return { user, projectName };
                }
            }
        } catch (error) {
            console.error(`Error searching ${projectName}:`, error);
            continue;
        }
    }

    console.log(`User with phone ${phoneNumber} not found in any project`);
    return null;
}

/**
 * Find user by Telegram chat ID
 */
export async function findUserByChatId(
    chatId: number
): Promise<{ user: UserModel; projectName: string } | null> {
    const healthyDbs = await getHealthyDbInstances();

    for (const [projectName, db] of Object.entries(healthyDbs)) {
        try {
            const usersRef = db.collection('users');
            const query = await retryDatabaseOperation(async () => {
                return await usersRef
                    .where('telegramChatID', '==', chatId.toString())
                    .limit(1)
                    .get();
            }, 2, 1000);

            if (!query.empty) {
                const doc = query.docs[0];
                if (doc && doc.exists) {
                    const user = { id: doc.id, uid: doc.data().uid, ...doc.data() } as UserModel;
                    return { user, projectName };
                }
            }
        } catch (error) {
            console.error(`Error searching by chatId in ${projectName}:`, error);
            continue;
        }
    }
    return null;
}

/**
 * Update user's Telegram chat ID
 */
export async function updateUserChatId(
    userId: string,
    chatId: number,
    projectName: string
): Promise<boolean> {
    const db = (await getHealthyDbInstances())[projectName];
    if (!db) {
        throw new Error(`Database for project ${projectName} is not healthy`);
    }

    try {
        await retryDatabaseOperation(async () => {
            return await db.collection('users').doc(userId).update({
                telegramChatID: chatId.toString(),
                updatedAt: new Date().toISOString()
            });
        }, 2, 1000);

        console.log(`Updated telegramChatID for user ${userId} in ${projectName}`);
        return true;
    } catch (error) {
        console.error(`Failed to update telegramChatID for user ${userId}:`, error);
        return false;
    }
}