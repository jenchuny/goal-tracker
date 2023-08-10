// src/firebaseUtils.js
import { collection } from 'firebase/firestore';
import { db } from './index';

export const goalsCollection = collection(db, 'goals');
