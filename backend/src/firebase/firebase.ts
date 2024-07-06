import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, UserCredential, Auth } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL, listAll, deleteObject, StorageReference, UploadResult } from 'firebase/storage';

// Replace with your Firebase config object
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id",
  measurementId: "your-measurement-id"
};

// Initialize Firebase app
const app: FirebaseApp = initializeApp(firebaseConfig);

// Firebase authentication
const auth: Auth = getAuth(app);
const provider = new GoogleAuthProvider();

const signInWithGoogle = async (): Promise<UserCredential> => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
    console.log('User signed out successfully');
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// Firebase Storage
const storage = getStorage(app);

const uploadFile = async (file: File, path: string): Promise<string> => {
  try {
    const storageRef: StorageReference = ref(storage, `${path}/${file.name}`);
    const result: UploadResult = await uploadBytes(storageRef, file);
    const downloadURL: string = await getDownloadURL(result.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading file to Firebase:', error);
    throw error;
  }
};

const listFiles = async (path: string): Promise<string[]> => {
  try {
    const listRef: StorageReference = ref(storage, path);
    const res = await listAll(listRef);
    return res.items.map(itemRef => itemRef.fullPath);
  } catch (error) {
    console.error('Error listing files in Firebase Storage:', error);
    throw error;
  }
};

export {
  app,
  auth,
  storage,
  signInWithGoogle,
  signOutUser,
  uploadFile,
  listFiles
};
