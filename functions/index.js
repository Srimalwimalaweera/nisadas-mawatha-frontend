const functions = require("firebase-functions");
const admin = require("firebase-admin");
// const {google} = require("googleapis"); // <-- අනවශ්‍ය නිසා මෙම පේළිය ඉවත් කළා
const {getStorage} = require("firebase-admin/storage");

admin.initializeApp();

// const TARGET_DRIVE_FOLDER_ID = "..."; // <-- අනවශ්‍ය නිසා මෙම පේළිය ඉවත් කළා

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
        "unauthenticated",
        "You must be logged in to make a purchase.",
    );
  }

  const {bookId, fileData, fileName, fileType} = data;
  const userId = context.auth.uid;

  const bucket = getStorage().bucket();
  const filePath = `payment_slips/${userId}_${bookId}_${fileName}`;
  const file = bucket.file(filePath);

  const buffer = Buffer.from(fileData, "base64");

  try {
    await file.save(buffer, {
      metadata: {
        contentType: fileType,
      },
    });
    functions.logger.info(`File uploaded to Firebase Storage at: ${filePath}`);

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
        "internal",
        "An error occurred while submitting your request.",
    );
  }
});
