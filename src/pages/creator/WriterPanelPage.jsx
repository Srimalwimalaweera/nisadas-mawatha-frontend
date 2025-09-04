// src/pages/creator/WriterPanelPage.jsx (RENAMED CLASSES)

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import TagInput from '../../components/ui/TagInput';
import './WriterPanelPage.css'; // The CSS file will also be updated
import MonetizationToggle from '../../components/ui/MonetizationToggle';

import { storage, db } from '../../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const UploadIcon = () => (
  <svg className="wp-uploader-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l-3.75 3.75M12 9.75l3.75 3.75M3 17.25V21h18v-3.75M3.75 16.5h16.5" />
  </svg>
);

function WriterPanelPage() {
  const { currentUser } = useAuth();

  // State management remains the same
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState('');
  const [ebookFile, setEbookFile] = useState(null);
  const [isForSale, setIsForSale] = useState(false);
  const [price, setPrice] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [language, setLanguage] = useState('Sinhala');
  const [category, setCategory] = useState('Novel');
  const [tags, setTags] = useState([]);
  const [publishOption, setPublishOption] = useState('now');
  const [scheduledDateTime, setScheduledDateTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const coverInputRef = useRef(null);
  const ebookInputRef = useRef(null);
  const [coverError, setCoverError] = useState('');
  const [ebookError, setEbookError] = useState('');
  const [formError, setFormError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (currentUser?.displayName) {
      setAuthorName(currentUser.displayName);
    }
  }, [currentUser]);

  // All functions remain the same
  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    setCoverError('');
    if (!file) return;
    const allowedTypes = ['image/png', 'image/jpeg', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      setCoverError('Invalid file type. Please upload PNG, JPG, or SVG.');
      return;
    }
    const maxSizeInBytes = 3 * 1024 * 1024; // 3MB
    if (file.size > maxSizeInBytes) {
      setCoverError('File is too large. Maximum size is 3MB.');
      return;
    }
    setCoverImage(file);
    const previewUrl = URL.createObjectURL(file);
    setCoverImagePreview(previewUrl);
  };
   const handleEbookFileChange = (e) => {
    const file = e.target.files[0];
    setEbookError('');
    if (!file) return;
    if (file.type !== 'application/pdf') {
        setEbookError('Invalid file type. Please upload a PDF file.');
        return;
    }
    setEbookFile(file);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(''); setCoverError(''); setEbookError('');
    if (!ebookFile || !coverImage || !title.trim() || !description.trim() || !authorName.trim() || !language || !category) {
        setFormError('Please fill in all required fields.');
        return;
    }
    setIsLoading(true);
    setUploadProgress(0);
    try {
      const uploadFile = (file, path) => {
        return new Promise((resolve, reject) => {
          const storageRef = ref(storage, path);
          const uploadTask = uploadBytesResumable(storageRef, file);
          uploadTask.on('state_changed', 
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress(progress);
            }, 
            (error) => reject(error), 
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                resolve(downloadURL);
              });
            }
          );
        });
      };
      const coverPath = `uploads/${currentUser.uid}/cover-img/${Date.now()}-${coverImage.name}`;
      const ebookPath = `uploads/${currentUser.uid}/pdf/${Date.now()}-${ebookFile.name}`;
      const coverImageUrl = await uploadFile(coverImage, coverPath);
      setUploadProgress(0); 
      const ebookFileUrl = await uploadFile(ebookFile, ebookPath);
      const bookData = {
        title, description, authorName, authorId: currentUser.uid,
        coverImageUrl, ebookFileUrl, language, category, tags,
        isForSale, price: isForSale ? Number(price) : 0,
        status: publishOption === 'now' ? 'published' : 'scheduled',
        uploadedAt: serverTimestamp(),
        publishedAt: publishOption === 'now' ? serverTimestamp() : new Date(scheduledDateTime),
      };
      await addDoc(collection(db, "books"), bookData);
      alert('eBook published successfully!');
    } catch (error) {
      console.error("Error publishing book:", error);
      setFormError(`An error occurred: ${error.message}`);
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    // The main container class is now unique
    <div className="wp-container">
      <form onSubmit={handleSubmit} className="wp-upload-form">
        <div className="wp-form-header">
          <h1>Upload a New eBook</h1>
          <p>Fill in the details below to publish your work.</p>
        </div>

        {formError && <p className="wp-upload-error-message wp-form-error-main">{formError}</p>}
        
        {isLoading && (
            <div className="wp-progress-bar-container">
                <div className="wp-progress-bar" style={{ width: `${uploadProgress}%` }}></div>
                <span>Uploading... {Math.round(uploadProgress)}%</span>
            </div>
        )}

        <div className="wp-form-main-content">
          <div className="wp-form-left-column">
            <div className="wp-pdf-and-meta-grid">
              <div className="wp-form-group">
                <label>eBook File (PDF)</label>
                <div className="wp-file-uploader-box wp-pdf-uploader" onClick={() => ebookInputRef.current.click()}>
                  <input type="file" accept=".pdf" onChange={handleEbookFileChange} className="wp-file-input-hidden" ref={ebookInputRef}/>
                  {ebookFile ? (
                    <div className="wp-file-name-display"><span>📄</span> {ebookFile.name}</div>
                  ) : (
                    <div className="wp-uploader-prompt"><UploadIcon /><span>Click to upload PDF</span></div>
                  )}
                </div>
                {ebookError && <p className="wp-upload-error-message">{ebookError}</p>}
              </div>
              <div className="wp-pdf-meta-inputs">
                <div className="wp-form-group">
                  <label htmlFor="language">Language</label>
                  <select id="language" value={language} onChange={(e) => setLanguage(e.target.value)}>
                    <option>Sinhala</option><option>English</option><option>Tamil</option>
                  </select>
                </div>
                <div className="wp-form-group">
                  <label htmlFor="category">Category</label>
                  <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option>Novel</option><option>Short Story</option><option>Poetry</option><option>Educational</option><option>Fantasy</option><option>Biography</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="wp-form-group">
              <label htmlFor="title">Title</label>
              <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Madol Doova"/>
            </div>
            <div className="wp-form-group">
              <label htmlFor="description">Description</label>
              <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows="6" placeholder="Tell readers about your book..."></textarea>
            </div>
             <div className="wp-form-group">
              <label htmlFor="author">Author Name</label>
              <input type="text" id="author" value={authorName} onChange={(e) => setAuthorName(e.target.value)} />
            </div>
          </div>
          <div className="wp-form-right-column">
             <div className="wp-form-group">
              <label htmlFor="cover-image">Cover Image</label>
              <div className="wp-file-uploader-box wp-cover-uploader" onClick={() => coverInputRef.current.click()}>
                <input type="file" id="cover-image" accept="image/png, image/jpeg, image/svg+xml" onChange={handleCoverImageChange} className="wp-file-input-hidden" ref={coverInputRef}/>
                {coverImagePreview ? (
                  <img src={coverImagePreview} alt="Cover Preview" className="wp-cover-preview" />
                ) : (
                  <div className="wp-uploader-prompt"><UploadIcon /><span>Upload your cover image</span><small>PNG, JPG, SVG (Max 3MB)</small></div>
                )}
              </div>
              {coverError && <p className="wp-upload-error-message">{coverError}</p>}
            </div>
             <div className="wp-form-group">
              <label>Monetization</label>
              <MonetizationToggle isForSale={isForSale} setIsForSale={setIsForSale} />
              {isForSale && (
                <div className="wp-price-input-wrapper">
                  <span className="wp-price-currency">LKR</span>
                  <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g., 500.00" required={isForSale}/>
                </div>
              )}
            </div>
            <div className="wp-form-group">
                <label>Tags</label>
                <TagInput tags={tags} setTags={setTags} />
            </div>
             <div className="wp-form-group">
                <label>Publishing Options</label>
                <div className="wp-publish-options-container">
                  <label className={`wp-publish-option ${publishOption === 'now' ? 'active' : ''}`}>
                    <input type="radio" name="publishOption" value="now" checked={publishOption === 'now'} onChange={(e) => setPublishOption(e.target.value)} />
                    <span>Publish Now</span>
                  </label>
                  <label className={`wp-publish-option ${publishOption === 'schedule' ? 'active' : ''}`}>
                    <input type="radio" name="publishOption" value="schedule" checked={publishOption === 'schedule'} onChange={(e) => setPublishOption(e.target.value)} />
                    <span>Schedule</span>
                  </label>
                </div>
                 {publishOption === 'schedule' && (
                    <input type="datetime-local" value={scheduledDateTime} onChange={(e) => setScheduledDateTime(e.target.value)} className="wp-schedule-input" required={publishOption === 'schedule'}/>
                 )}
            </div>
          </div>
        </div>
        <div className="wp-form-footer">
          <button type="submit" className="wp-publish-btn" disabled={isLoading}>
            {isLoading ? 'Publishing...' : 'Publish eBook'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default WriterPanelPage;