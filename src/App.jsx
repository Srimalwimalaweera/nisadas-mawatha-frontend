import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout.jsx';
import Homepage from './pages/Homepage.jsx';
import BookDetailsPage from './pages/BookDetailsPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import PurchasePage from './pages/PurchasePage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import AdminRoute from './components/common/AdminRoute.jsx';
import MyLibraryPage from './pages/MyLibraryPage.jsx';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';
import AuthBook from './pages/AuthBook.jsx';
import WritersPage from './pages/WritersPage.jsx';
import CreatorPanelRouter from './pages/creator/CreatorPanelRouter.jsx';
import ReaderPanelPage from './pages/creator/ReaderPanelPage.jsx';
import WriterPanelPage from './pages/creator/WriterPanelPage.jsx';
import PhotographerPanelPage from './pages/creator/PhotographerPanelPage.jsx';
import StudentPanelPage from './pages/creator/StudentPanelPage.jsx';
import CreatorRoute from './components/common/CreatorRoute';
import PdfReaderPage from './pages/PdfReaderPage';
// LoginPage, SignupPage වැනි pages මෙතනට import කිරීම අවශ්‍ය නැහැ.

function App() {
  return (
    <Layout>
      <Routes>
        {/* --- 1. AuthBook එකට සම්බන්ධ සියලුම paths, AuthBook component එකට යොමු කිරීම --- */}
        <Route path="/auth" element={<AuthBook />} />
        <Route path="/login" element={<AuthBook />} />
        <Route path="/signup" element={<AuthBook />} />
        <Route path="/terms" element={<AuthBook />} />
        <Route path="/privacy-policy" element={<AuthBook />} />
        <Route path="/about" element={<AuthBook />} />
        
        <Route path="/Auth" element={<AuthBook />} />
<Route path="/Login" element={<AuthBook />} />
        <Route path="/Signup" element={<AuthBook />} />
        <Route path="/Terms" element={<AuthBook />} />
        <Route path="/Privacy-policy" element={<AuthBook />} />
        <Route path="/About" element={<AuthBook />} />

        {/* --- ඉතිරි routes පෙර පරිදිම --- */}
        <Route path="/" element={<Homepage />} />
        <Route path="/books/:bookId" element={<BookDetailsPage />} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/purchase/:bookId" element={<PurchasePage />} />
        <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
        <Route path="/my-library" element={ <ProtectedRoute><MyLibraryPage /></ProtectedRoute> } />
        <Route path="/writers" element={<WritersPage />} />
       <Route path="/creator" element={<CreatorPanelRouter />} />

        {/* Specific creator panel routes are now all protected by our new intelligent CreatorRoute */}
        <Route path="/creator/writer" element={<CreatorRoute><WriterPanelPage /></CreatorRoute>} />
        <Route path="/creator/photographer" element={<CreatorRoute><PhotographerPanelPage /></CreatorRoute>} />
        <Route path="/creator/student" element={<CreatorRoute><StudentPanelPage /></CreatorRoute>} />
        <Route path="/creator/reader" element={<CreatorRoute><ReaderPanelPage /></CreatorRoute>} />
        <Route path="/read/:bookId" element={<PdfReaderPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
