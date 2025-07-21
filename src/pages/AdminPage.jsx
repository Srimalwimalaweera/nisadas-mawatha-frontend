import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { getFunctions, httpsCallable } from "firebase/functions";
import './AdminPage.css';

function AdminPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const q = query(collection(db, "purchases"), where("status", "==", "pending"));
        const purchaseSnapshot = await getDocs(q);

        const getRequestDetails = async (purchaseDoc) => {
          const purchaseData = purchaseDoc.data();
          const userRef = doc(db, 'users', purchaseData.userId);
          const userSnap = await getDoc(userRef);
          const userData = userSnap.exists() ? userSnap.data() : { displayName: 'Unknown User' };

          const bookRef = doc(db, 'books', purchaseData.bookId);
          const bookSnap = await getDoc(bookRef);
          const bookData = bookSnap.exists() ? bookSnap.data() : { title: 'Unknown Book' };

          return {
            id: purchaseDoc.id,
            ...purchaseData,
            user: userData,
            book: bookData,
          };
        };

        const detailedRequests = await Promise.all(purchaseSnapshot.docs.map(doc => getRequestDetails(doc)));
        setRequests(detailedRequests);

      } catch (error) {
        console.error("Error fetching pending requests: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingRequests();
  }, []);

  // "View Slip" click කළාම දුවන අලුත් function එක
  const handleViewSlip = async (slipPath) => {
    try {
      const functions = getFunctions();
      const getSlipUrl = httpsCallable(functions, 'getSlipUrl');
      const result = await getSlipUrl({ slipStoragePath: slipPath });

      if (result.data.url) {
        window.open(result.data.url, '_blank'); // අලුත් tab එකකින් URL එක open කරනවා
      }
    } catch (error) {
      console.error("Error getting slip URL:", error);
      alert("Could not get slip URL. " + error.message);
    }
  };

  if (loading) {
    return <p>Loading pending requests...</p>;
  }

  return (
    <div className="admin-container">
      <h1>Pending Purchase Requests</h1>
      {requests.length === 0 ? (
        <p>No pending requests found.</p>
      ) : (
        <table className="requests-table">
          {/* ... thead ... */}
          <thead>
            <tr>
              <th>Submitted At</th>
              <th>User</th>
              <th>Book Title</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(req => (
              <tr key={req.id}>
                <td>{new Date(req.submittedAt.seconds * 1000).toLocaleString()}</td>
                <td>{req.user.displayName || req.user.email}</td>
                <td>{req.book.title}</td>
                <td className="actions-cell">
                  {/* "View Slip" දැන් button එකක්, link එකක් නෙවෙයි */}
                  <button onClick={() => handleViewSlip(req.slipStoragePath)} className="action-btn view-btn">View Slip</button>
                  <button className="action-btn approve-btn">Approve</button>
                  <button className="action-btn reject-btn">Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminPage;