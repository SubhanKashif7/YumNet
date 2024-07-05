// firebase.ts

import { initializeApp, FirebaseApp } from "firebase/app";
import { 
  getAuth, 
  signInWithPopup, 
  signOut, 
  GoogleAuthProvider, 
  UserCredential, 
  Auth 
} from "firebase/auth";
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  listAll, 
  deleteObject, 
  StorageReference,
  UploadResult
} from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyD5wY2m6oIadWzfU8HF6rocqpIHFD7JGLg",
    authDomain: "yumnet-6895f.firebaseapp.com",
    projectId: "yumnet-6895f",
    storageBucket: "yumnet-6895f.appspot.com",
    messagingSenderId: "770785399601",
    appId: "1:770785399601:web:2c2f60f3e8517dfe8b9610",
    measurementId: "G-WRN7V9LCKB"
  };
// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth: Auth = getAuth(app);
const storage = getStorage(app);

// Authentication functions
const signInWithGoogle = async (): Promise<UserCredential> => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return result;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out", error);
    throw error;
  }
};

// Storage functions
const uploadFile = async (file: File, path: string): Promise<string> => {
  try {
    const storageRef: StorageReference = ref(storage, `${path}/${file.name}`);
    const result: UploadResult = await uploadBytes(storageRef, file);
    const downloadURL: string = await getDownloadURL(result.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading file", error);
    throw error;
  }
};

const listFiles = async (path: string): Promise<string[]> => {
  try {
    const listRef: StorageReference = ref(storage, path);
    const res = await listAll(listRef);
    return res.items.map(itemRef => itemRef.fullPath);
  } catch (error) {
    console.error("Error listing files", error);
    throw error;
  }
};

const deleteFile = async (path: string): Promise<void> => {
  try {
    const desertRef = ref(storage, path);
    await deleteObject(desertRef);
  } catch (error) {
    console.error("Error deleting file", error);
    throw error;
  }
};

// Usage examples
const exampleUsage = async () => {
  // Sign in
  try {
    const userCredential = await signInWithGoogle();
    console.log("Signed in user:", userCredential.user);
  } catch (error) {
    console.error("Sign-in error:", error);
  }

  // Upload a file
  const file = new File(["Hello, World!"], "hello.txt", { type: "text/plain" });
  try {
    const url = await uploadFile(file, 'documents');
    console.log("File uploaded, URL:", url);
  } catch (error) {
    console.error("Upload error:", error);
  }

  // List files
  try {
    const files = await listFiles('documents');
    console.log("Files in 'documents' folder:", files);
  } catch (error) {
    console.error("List error:", error);
  }

  // Delete a file
  try {
    await deleteFile('documents/hello.txt');
    console.log("File deleted successfully");
  } catch (error) {
    console.error("Delete error:", error);
  }

  // Sign out
  try {
    await signOutUser();
    console.log("User signed out successfully");
  } catch (error) {
    console.error("Sign-out error:", error);
  }
};

// Export everything
export {
  app,
  auth,
  storage,
  signInWithGoogle,
  signOutUser,
  uploadFile,
  listFiles,
  deleteFile,
  exampleUsage
};