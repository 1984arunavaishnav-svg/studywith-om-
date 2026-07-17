// ======================================
// StudyWithOm CMS
// Firebase Connection
// ======================================

import { db, auth } from "../../firebase/firebase-config.js";

export { db, auth };

console.log("Firebase Connected ✅");
console.log(db);
console.log(auth);