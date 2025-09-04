const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const db = admin.firestore();

/**
 * Handles user registration via Email/Password.
 * Creates an Auth user and a corresponding document in Firestore.
 */
exports.registerUser = functions.https.onCall(async (data, context) => {
  const {email, password, role} = data;

  // Security: Ensure a valid role is provided and not 'admin'.
  const allowedRoles = ["reader", "writer", "photographer", "student"];
  if (!allowedRoles.includes(role)) {
    throw new functions.https.HttpsError(
        "invalid-argument",
        "Invalid role specified.",
    );
  }

  try {
    // Create the user in Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
      displayName: email.split("@")[0], // Default display name
    });

    // Set custom claim for the role (useful for security rules)
    await admin.auth().setCustomUserClaims(userRecord.uid, {role: role});

    // Create a document in the 'users' collection in Firestore
    await db.collection("users").doc(userRecord.uid).set({
      email: userRecord.email,
      displayName: userRecord.email.split("@")[0],
      role: role,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return {success: true, uid: userRecord.uid};
  } catch (error) {
    throw new functions.https.HttpsError("internal", error.message);
  }
});

/**
 * Sets the role for a user who signed up with Google.
 */
exports.setGoogleUserRole = functions.https.onCall(async (data, context) => {
  // Check if the user is authenticated.
  if (!context.auth) {
    throw new functions.https.HttpsError(
        "unauthenticated",
        "The function must be called while authenticated.",
    );
  }

  const {role} = data;
  const uid = context.auth.uid;
  const user = await admin.auth().getUser(uid);

  // Security: Ensure a valid role is provided and not 'admin'.
  const allowedRoles = ["reader", "writer", "photographer", "student"];
  if (!allowedRoles.includes(role)) {
    throw new functions.https.HttpsError(
        "invalid-argument",
        "Invalid role specified.",
    );
  }

  // Set custom claim for the role
  await admin.auth().setCustomUserClaims(uid, {role: role});

  // Create or update the user document in Firestore
  await db.collection("users").doc(uid).set({
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    role: role,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  }, {merge: true}); // Use merge to not overwrite existing data if any

  return {success: true};
});