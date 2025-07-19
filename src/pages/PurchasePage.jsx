import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import './PurchasePage.css';
import { getFunctions, httpsCallable } from "firebase/functions";

function PurchasePage() {
  const { bookId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [slipFile, setSlipFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!currentUser) {
      navigate(`/login?redirect=/purchase/${bookId}`);
    }
    
    const fetchBook = async () => {
      const bookRef = doc(db, 'books', bookId);
      const bookSnap = await getDoc(bookRef);
      if (bookSnap.exists()) {
        setBook(bookSnap.data());
      } else {
        setError("Book not found!");
      }
      setLoading(false);
    };

    if (currentUser) {
      fetchBook();
    }
  }, [currentUser, navigate, bookId]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSlipFile(file);
      setError('');
    } else {
      setSlipFile(null);
      setError('Please upload a valid image file (jpg, png).');
    }
  };

  // නිවැරදි handleSubmit function එක component එක ඇතුළේ තියෙන්න ඕන
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!slipFile) {
      return setError('Please select a payment slip image to upload.');
    }
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const reader = new FileReader();
      reader.readAsDataURL(slipFile);
      reader.onload = async () => {
        const base64File = reader.result.split(',')[1];

        const functions = getFunctions();
        const submitPurchaseRequest = httpsCallable(functions, 'submitPurchaseRequest');
        
        const result = await submitPurchaseRequest({
          bookId: bookId,
          fileData: base64File,
          fileName: slipFile.name,
          fileType: slipFile.type,
        });

        if (result.data.success) {
          setSuccess('Your request has been submitted successfully! We will verify it and grant access within 24 hours.');
        } else {
          setError('An unknown error occurred while submitting.');
        }
        setLoading(false);
      };
      reader.onerror = () => {
        setError('Failed to read the file.');
        setLoading(false);
      }
    } catch (error) {
      console.error("Error calling cloud function: ", error);
      setError(error.message);
      setLoading(false);
    }
  };

  if (loading && !book) {
    return <p>Loading...</p>;
  }

  return (
    <div className="purchase-container">
      <h1>Complete Your Purchase</h1>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      
      {!success && (
        <form onSubmit={handleSubmit}>
          <div className="payment-instructions">
            <h2>Payment Instructions</h2>
            <p>Please deposit <strong>LKR {book ? book.price : '...'}</strong> to the following bank account:</p>
            <ul className="bank-details">
              <li><strong>Bank Name:</strong> YOUR BANK NAME</li>
              <li><strong>Account Name:</strong> YOUR ACCOUNT NAME</li>
              <li><strong>Account Number:</strong> YOUR ACCOUNT NUMBER</li>
              <li><strong>Reference:</strong> Please mention book ID: <strong>{bookId}</strong></li>
            </ul>
            <p className="important-note">After making the deposit, please upload a clear photo of the payment slip or a screenshot of the transaction confirmation below.</p>
          </div>
          <div className="upload-section">
            <label htmlFor="slip-upload">Upload Payment Slip:</label>
            <input 
              type="file" 
              id="slip-upload" 
              onChange={handleFileChange} 
              accept="image/png, image/jpeg"
              required 
            />
            <button type="submit" disabled={loading} className="upload-button">
              {loading ? 'Submitting...' : 'Submit for Verification'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default PurchasePage;