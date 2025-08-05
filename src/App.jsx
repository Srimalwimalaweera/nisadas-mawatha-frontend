import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout.jsx';
import Homepage from './pages/Homepage.jsx';
import BookDetailsPage from './pages/BookDetailsPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
import PurchasePage from './pages/PurchasePage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import AdminRoute from './components/common/AdminRoute.jsx';
import MyLibraryPage from './pages/MyLibraryPage.jsx';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';
import TermsPage from './pages/TermsPage.jsx';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage.jsx';
import AuthBook from './pages/AuthBook.jsx';
import AboutPage from './pages/AboutPage.jsx';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/auth" element={<AuthBook />} />
        <Route path="/books/:bookId" element={<BookDetailsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/purchase/:bookId" element={<PurchasePage />} />
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          } 
        />
        <Route path="/my-library" element={ <ProtectedRoute><MyLibraryPage /></ProtectedRoute> } />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </Layout>
  );
}

export default App;