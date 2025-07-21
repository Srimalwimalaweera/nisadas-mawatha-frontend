const functions = require("firebase-functions");
const admin = require("firebase-admin");

// getStorage import එක මෙතනින් ඉවත් කළා
// googleapis import එකත් කලින් ඉවත් කළා

admin.initializeApp();

// === Function 1: Create User Profile (v1 Syntax) ===
exports.createNewUserProfile = functions.auth.user()
    .onCreate((user) => {
      const {uid, email, displayName, photoURL} = user;
      functions.logger
          .info(`v1: Creating profile for ${displayName || email} (${uid})`);
      const profileData = {
        email: email,
        displayName: displayName || null,
        photoURL: photoURL || null,
        role: "reader",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        notebook_slots_total: 5,
        ebook_slots_total: 0,
        pdf_slots_total: 0,
      };
      return admin.firestore().collection("users").doc(uid).set(profileData)
          .then(() => {
            functions.logger.info(`v1: Profile created for ${uid}`);
            return null;
          })
          .catch((error) => {
            functions.logger.error("v1: Error creating profile:", error);
            return null;
          });
    });

// === Function 2: Submit Purchase Request (Firebase Storage සමග) ===
exports.submitPurchaseRequest = functions.runWith({
  memory: "512MB",
  timeoutSeconds: 120,
}).https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
        "unauthenticated", "You must be logged in to make a purchase.",
    );
  }
  const {bookId, fileData, fileName, fileType} = data;
  const userId = context.auth.uid;
  const bucket = admin.storage().bucket();
  const filePath = `payment_slips/${userId}_${bookId}_${fileName}`;
  const file = bucket.file(filePath);
  const buffer = Buffer.from(fileData, "base64");
  try {
    await file.save(buffer, {
      metadata: {contentType: fileType},
    });
    functions.logger.info(`File uploaded to Storage at: ${filePath}`);
    const purchaseData = {
      userId: userId,
      bookId: bookId,
      status: "pending",
      submittedAt: admin.firestore.FieldValue.serverTimestamp(),
      slipStoragePath: filePath,
    };
    const docRef = await admin.firestore().collection("purchases").add(purchaseData);
    functions.logger.info(`Purchase record created: ${docRef.id}`);
    return {success: true, message: "Purchase request submitted!"};
  } catch (error) {
    functions.logger.error("Error in purchase flow:", error);
    throw new functions.https.HttpsError(
        "internal", "An error occurred while submitting your request.",
    );
  }
});

// === Function 3: Get Secure Download URL for a Slip (v1 Syntax) ===
exports.getSlipUrl = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
        "unauthenticated", "You must be logged in.",
    );
  }
  const userDoc = await admin.firestore().collection("users").doc(context.auth.uid).get();
  if (userDoc.data().role !== "admin") {
    throw new functions.https.HttpsError(
        "permission-denied", "You must be an admin to perform this action.",
    );
  }
  const {slipStoragePath} = data;
  if (!slipStoragePath) {
    throw new functions.https.HttpsError(
        "invalid-argument", "The function must be called with a slipStoragePath.",
    );
  }
  const options = {
    version: "v4",
    action: "read",
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
  };
  try {
    const [url] = await admin.storage().bucket().file(slipStoragePath).getSignedUrl(options);
    return {url: url};
  } catch (error) {
    functions.logger.error("Error generating signed URL:", error);
    throw new functions.https.HttpsError(
        "internal", "Could not get the slip URL.",
    );
  }
});
