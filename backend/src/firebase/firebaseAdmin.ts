import * as admin from 'firebase-admin';
// import * as serviceAccount from './fservice.json';

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    databaseURL: "https://your-project-id.firebaseio.com"
});

// Import Firebase Storage module
import 'firebase/storage';

export const storage = admin.storage(); // Initialize Firebase Storage

export default admin;
