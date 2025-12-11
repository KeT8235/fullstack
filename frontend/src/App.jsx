import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import './components/Sidebar.css';
import './components/DashboardMain.css';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import JoinPage from './pages/JoinPage';
import MyPage from './pages/MyPage';
import AdminPage from './pages/AdminPage';
import DocumentList from './pages/DocumentList'; // DocumentList 임포트
import DocumentEditor from './pages/DocumentEditor'; // DocumentEditor 임포트
import ArticleListPage from './pages/ArticleListPage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import ArticleEditorPage from './pages/ArticleEditorPage';
import ProtectedRoute from './routes/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', minHeight: '100vh', background: '#fafbfc' }}>
        <Sidebar />
        <div style={{ flex: 1, marginLeft: 220, display: 'flex', flexDirection: 'column' }}>
          <Navbar />
          <main style={{ flex: 1, padding: '32px 40px' }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/join" element={<JoinPage />} />
              {/* 게시판 관련 라우트 */}
              <Route path="/articles" element={<ArticleListPage />} />
              <Route path="/articles/:id" element={<ArticleDetailPage />} />
              {/* 로그인한 사용자만 접근 가능한 페이지 */}
              <Route element={<ProtectedRoute />}>
                <Route path="/my-page" element={<MyPage />} />
                <Route path="/my-documents" element={<DocumentList />} />
                <Route path="/documents/new" element={<DocumentEditor />} />
                <Route path="/documents/edit/:id" element={<DocumentEditor />} />
                <Route path="/articles/new" element={<ArticleEditorPage />} />
                <Route path="/articles/edit/:id" element={<ArticleEditorPage />} />
              </Route>
              {/* 관리자 역할 사용자만 접근 가능한 페이지 */}
              <Route element={<ProtectedRoute adminOnly={true} />}>
                <Route path="/admin" element={<AdminPage />} />
              </Route>
              {/* 404 Not Found 페이지 (옵션) */}
              <Route path="*" element={<h2>404 Not Found</h2>} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
