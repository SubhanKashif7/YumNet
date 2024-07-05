import * as admin from 'firebase-admin';
import * as serviceAccount from './fservice.json';

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    databaseURL: "https://your-project-id.firebaseio.com" // Replace with your database URL
});

export default admin;
