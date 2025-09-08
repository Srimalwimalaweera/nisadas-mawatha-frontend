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

// Add this helper function at the top with your other requires
const { FieldValue } = require("firebase-admin/firestore");

// NEW addComment (initializes reactionCounts)
exports.addComment = functions.region("us-central1").https.onCall(async (data, context) => {
    // ... (validation code is the same)
    if (!context.auth) { throw new functions.https.HttpsError("unauthenticated", "Auth required."); }
    const { bookId, content } = data;
    const userId = context.auth.uid;
    if (!bookId || !content || content.trim() === "") { throw new functions.https.HttpsError("invalid-argument", "Required fields missing."); }

    const commentRef = db.collection("comments").doc(bookId);
    const newComment = {
        id: `comment_${Date.now()}`,
        userId: userId,
        content: content,
        replies: [],
        timestamp: new Date(),
        reactionCounts: { love: 0, like: 0, fire: 0, haha: 0, sad: 0, angry: 0 } // <-- Initialize counts
    };
    // ... (rest of the transaction logic is the same)
    try {
        await db.runTransaction(async (transaction) => {
          const doc = await transaction.get(commentRef);
          if (!doc.exists) {
            transaction.set(commentRef, { threads: [newComment] });
          } else {
            transaction.update(commentRef, {
              threads: FieldValue.arrayUnion(newComment),
            });
          }
        });
        return { success: true, comment: newComment };
      } catch (error) {
        console.error("Error adding comment in transaction:", error);
        throw new functions.https.HttpsError("internal", "Failed to add comment.");
      }
});

// NEW addReply (initializes reactionCounts)
exports.addReply = functions.region("us-central1").https.onCall(async (data, context) => {
    // ... (validation code is the same)
    if (!context.auth) { throw new functions.https.HttpsError("unauthenticated", "Auth required."); }
    const { bookId, commentId, content } = data;
    const userId = context.auth.uid;
    if (!bookId || !commentId || !content || content.trim() === "") { throw new functions.https.HttpsError("invalid-argument", "Required fields missing."); }

    const commentRef = db.collection("comments").doc(bookId);
    const newReply = {
        id: `reply_${Date.now()}`,
        userId: userId,
        content: content,
        timestamp: new Date(),
        reactionCounts: { love: 0, like: 0, fire: 0, haha: 0, sad: 0, angry: 0 } // <-- Initialize counts
    };
    // ... (rest of the transaction logic is the same)
    return db.runTransaction(async (transaction) => {
        const doc = await transaction.get(commentRef);
        if (!doc.exists) { throw new functions.https.HttpsError("not-found", "Comment thread not found."); }
        const threads = doc.data().threads || [];
        const commentIndex = threads.findIndex((c) => c.id === commentId);
        if (commentIndex === -1) { throw new functions.https.HttpsError("not-found", "Comment to reply to not found."); }
        threads[commentIndex].replies.push(newReply);
        transaction.update(commentRef, { threads: threads });
        return { success: true, reply: newReply };
    });
});


// NEW toggleCommentReaction (replaces toggleCommentLike)
exports.toggleCommentReaction = functions.region("us-central1").https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "Authentication required.");
    }

    const { bookId, commentId, replyId, reactionType } = data;
    const userId = context.auth.uid;

    if (!bookId || !commentId || !reactionType) {
        throw new functions.https.HttpsError("invalid-argument", "Missing required fields.");
    }
    
    const validReactions = ["love", "like", "fire", "haha", "sad", "angry"];
    if (!validReactions.includes(reactionType)) {
        throw new functions.https.HttpsError("invalid-argument", "Invalid reaction type.");
    }

    const commentRef = db.collection("comments").doc(bookId);
    const reactionDocId = replyId ? `${bookId}_${commentId}_${replyId}` : `${bookId}_${commentId}`;
    const reactionRef = db.collection("commentReactions").doc(reactionDocId);

    return db.runTransaction(async (transaction) => {
        const commentDoc = await transaction.get(commentRef);
        const reactionDoc = await transaction.get(reactionRef);

        if (!commentDoc.exists) { throw new functions.https.HttpsError("not-found", "Comment thread not found."); }

        const threads = commentDoc.data().threads || [];
        const cIndex = threads.findIndex((c) => c.id === commentId);
        if (cIndex === -1) { throw new functions.https.HttpsError("not-found", "Comment not found."); }

        const oldReaction = reactionDoc.exists ? reactionDoc.data()[userId] : null;
        let targetItem; // This will be the comment or reply object we are modifying

        if(replyId) {
            const rIndex = threads[cIndex].replies.findIndex((r) => r.id === replyId);
            if (rIndex === -1) { throw new functions.https.HttpsError("not-found", "Reply not found."); }
            targetItem = threads[cIndex].replies[rIndex];
        } else {
            targetItem = threads[cIndex];
        }

        // --- Reaction Logic ---
        if (oldReaction === reactionType) { // User is removing their reaction
            transaction.update(reactionRef, { [userId]: FieldValue.delete() });
            targetItem.reactionCounts[reactionType] = Math.max(0, (targetItem.reactionCounts[reactionType] || 0) - 1);
        } else {
            if (oldReaction) { // User is changing reaction
                targetItem.reactionCounts[oldReaction] = Math.max(0, (targetItem.reactionCounts[oldReaction] || 0) - 1);
            }
            targetItem.reactionCounts[reactionType] = (targetItem.reactionCounts[reactionType] || 0) + 1;
            transaction.set(reactionRef, { [userId]: reactionType }, { merge: true });
        }
        
        transaction.update(commentRef, { threads: threads });
        return { success: true };
    });
});