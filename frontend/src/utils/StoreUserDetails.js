import { openDB } from "idb";

// Open or create a database and object store
const dbPromise = openDB("userDB", 1, {
  upgrade(db) {
    db.createObjectStore("users", { keyPath: "id" });
  },
});

// Save data to IndexedDB
export const saveToIndexedDB = async (data) => {
  const db = await dbPromise;
  await db.put("users", data);
};

// Retrieve data from IndexedDB
export const getFromIndexedDB = async (key) => {
  const db = await dbPromise;
  return await db.get("users", key);
};

// Retrieve token from IndexedDB
export const getToken = async () => {
  const db = await dbPromise;
  const userData = await db.get("users", "user");
  return userData ? userData.token : null;
};
// Retrieve userId from IndexedDB
export const getUserId = async () => {
  const db = await dbPromise;
  const userData = await db.get("users", "user");
  return userData ? userData.userId : null;
};

// Clear user data from IndexedDB
export const clearUserData = async () => {
  const db = await dbPromise;
  const tx = db.transaction("users", "readwrite");
  const store = tx.objectStore("users");
  store.clear();
  await tx.done;
};

export default {
  saveToIndexedDB,
  getFromIndexedDB,
  getToken,
  getUserId,
  clearUserData,
};
