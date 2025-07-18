import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout.jsx';
import Homepage from './pages/Homepage.jsx';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Homepage />} />
        {/* අනාගතයේදී අනිත් පිටු මෙතනට එකතු කරමු
          <Route path="/books" element={<BooksPage />} />
          <Route path="/login" element={<LoginPage />} />
        */}
      </Routes>
    </Layout>
  );
}

export default App;