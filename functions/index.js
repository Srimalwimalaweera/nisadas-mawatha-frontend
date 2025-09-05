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


/**
 * Handles updating a book's reaction counts and total.
 * Allows a user to add, change, or remove a reaction.
 */
exports.updateReaction = functions.https.onCall(async (data, context) => {
    // 1. Check if user is authenticated
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "The function must be called while authenticated."
      );
    }
  
    const { bookId, newReactionId } = data;
    const userId = context.auth.uid;
  
    // 2. Validate input data
    if (!bookId || !newReactionId) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "The function must be called with 'bookId' and 'newReactionId' arguments."
      );
    }
  
    const validReactions = ["love", "like", "fire", "haha", "sad", "angry"];
    if (!validReactions.includes(newReactionId)) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Invalid reaction type."
      );
    }
  
    // 3. Define database references
    const bookRef = db.collection("books").doc(bookId);
    const reactionRef = db.collection("reactions").doc(bookId);
    // New collection to track individual user reactions per book
    const reactionManagerRef = db.collection("reaction-manager").doc(bookId);
  
    // 4. Run a transaction to ensure data consistency
    try {
      await db.runTransaction(async (transaction) => {
        const bookDoc = await transaction.get(bookRef);
        const reactionDoc = await transaction.get(reactionRef);
        const reactionManagerDoc = await transaction.get(reactionManagerRef);
  
        if (!bookDoc.exists) {
          throw new functions.https.HttpsError("not-found", "Book not found.");
        }
  
        // Get current counts and totals
        let currentCounts = reactionDoc.exists ? reactionDoc.data() : {};
        let totalReactions = bookDoc.data().totalReactions || 0;
        
        // Get the user's previous reaction from the reaction-manager
        const oldReactionId = reactionManagerDoc.exists && reactionManagerDoc.data()[userId]
          ? reactionManagerDoc.data()[userId]
          : null;
  
        // Initialize counts if they don't exist
        validReactions.forEach((r) => {
          if (!currentCounts[r]) currentCounts[r] = 0;
        });
        
        // --- CORE LOGIC ---
        
        // Case A: User is removing their existing reaction
        if (newReactionId === oldReactionId) {
          if (oldReactionId) {
            currentCounts[oldReactionId] = Math.max(0, currentCounts[oldReactionId] - 1);
            totalReactions = Math.max(0, totalReactions - 1);
            // Remove user's reaction from the manager
            transaction.update(reactionManagerRef, { [userId]: admin.firestore.FieldValue.delete() });
          }
        
        // Case B: User is changing their reaction
        } else if (oldReactionId) {
          // Decrement old reaction count
          currentCounts[oldReactionId] = Math.max(0, currentCounts[oldReactionId] - 1);
          // Increment new reaction count
          currentCounts[newReactionId] = (currentCounts[newReactionId] || 0) + 1;
          // Update user's reaction in the manager
          transaction.update(reactionManagerRef, { [userId]: newReactionId });
          // Total reactions do not change in this case
  
        // Case C: User is adding a completely new reaction
        } else {
          // Increment new reaction count
          currentCounts[newReactionId] = (currentCounts[newReactionId] || 0) + 1;
          totalReactions += 1;
          // Set user's reaction in the manager. Use set with merge if doc might not exist.
          transaction.set(reactionManagerRef, { [userId]: newReactionId }, { merge: true });
        }
  
        // 5. Commit all updates to the database
        transaction.set(reactionRef, currentCounts, { merge: true });
        transaction.update(bookRef, { totalReactions: totalReactions });
      });
  
      return { success: true };
    } catch (error) {
      console.error("Reaction update transaction failed:", error);
      throw new functions.https.HttpsError(
        "internal",
        "Failed to update reaction.",
        error.message
      );
    }
});