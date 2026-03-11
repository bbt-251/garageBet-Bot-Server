import type { firestore } from 'firebase-admin';

export interface UserModel {
 id: string;
 uid: string;
 firstName: string;
 lastName: string;
 phone: string;
 createdAt: firestore.Timestamp;
 updatedAt: firestore.Timestamp;
 telegramChatID: string | null;
}
