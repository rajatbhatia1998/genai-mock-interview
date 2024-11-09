import { getFirestore } from "firebase/firestore";
import firebaseApp from './firebase-config';

const db = getFirestore(firebaseApp);
export default db;