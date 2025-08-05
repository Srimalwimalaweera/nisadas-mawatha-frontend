const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

// === Function 1 (NEW): Register User with Role ===
exports.registerUser = functions.https.onCall(async (data, context) => {
  const {email, password, role} = data;

  const allowedRoles = ["reader", "writer", "photographer", "student"];
  if (!allowedRoles.includes(role)) {
    throw new functions.https.HttpsError(
        "invalid-argument", "An invalid role was specified.",
    );
  }

  try {
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
      displayName: email.split("@")[0],
    });

    const profileData = {
      email: userRecord.email,
      displayName: userRecord.displayName,
      photoURL: userRecord.photoURL || null,
      role: role,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      notebook_slots_total: 5,
      ebook_slots_total: 0,
      pdf_slots_total: 0,
      withdrawable_balance: 0,
    };

    await admin.firestore().collection("users").doc(userRecord.uid).set(profileData);

    functions.logger.info(`New user created: ${userRecord.uid} with role: ${role}`);
    return {success: true, uid: userRecord.uid};
  } catch (error) {
    functions.logger.error("Error creating new user:", error);
    throw new functions.https.HttpsError("internal", error.message);
  }
});
// ... submitPurchaseRequest, getSlipUrl, processPurchaseRequest functions ...


// === Function 2: Submit Purchase Request (Firebase Storage සමග) ===
exports.submitPurchaseRequest = functions.runWith({
  memory: "512MB",
  timeoutSeconds: 120,
}).https.onCall(async (data, context) => {
  // ... (this function's code is correct and unchanged)
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
    await file.save(buffer, {metadata: {contentType: fileType}});
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
  // ... (this function's code is correct and unchanged)
  if (!context.auth) {/* ... */}
  const userDoc = await admin.firestore().collection("users").doc(context.auth.uid).get();
  if (userDoc.data().role !== "admin") {/* ... */}
  const {slipStoragePath} = data;
  if (!slipStoragePath) {/* ... */}
  const options = {
    version: "v4",
    action: "read",
    expires: Date.now() + 15 * 60 * 1000,
  };
  try {
    const [url] = await admin.storage().bucket().file(slipStoragePath).getSignedUrl(options);
    return {url: url};
  } catch (error) {
    functions.logger.error("Error generating signed URL:", error);
    throw new functions.https.HttpsError("internal", "Could not get the slip URL.");
  }
});

// === Function 4 & 5 Combined: Process Purchase Request (Approve/Reject) ===
exports.processPurchaseRequest = functions.https.onCall(async (data, context) => {
  // ... (this function's code is correct and unchanged)
  if (!context.auth) {/* ... */}
  const adminUserDoc = await admin.firestore().collection("users").doc(context.auth.uid).get();
  if (adminUserDoc.data().role !== "admin") {/* ... */}
  // ... rest of the function ...
});
