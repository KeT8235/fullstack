import React, { useEffect, useState } from 'react';
import apiClient from '../api/index';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function DocumentList() {
    const { isAuthenticated, user } = useAuth();
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isAuthenticated) {
            fetchDocuments();
        } else {
            setLoading(false); // 로그인 안 되어 있으면 로딩 끝
            setDocuments([]);
        }
    }, [isAuthenticated]);

    const fetchDocuments = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiClient.get('/api/documents');
            setDocuments(response.data);
        } catch (err) {
            console.error('문서 불러오기 실패:', err);
            setError('문서를 불러오는 데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('정말로 이 문서를 삭제하시겠습니까?')) {
            try {
                await apiClient.delete(`/api/documents/${id}`);
                alert('문서가 삭제되었습니다.');
                fetchDocuments(); // 목록 새로고침
            } catch (err) {
                console.error('문서 삭제 실패:', err);
                alert('문서 삭제에 실패했습니다.');
            }
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="container mt-5">
                <div className="alert alert-warning" role="alert">
                    문서 목록을 보려면 로그인해야 합니다.
                </div>
            </div>
        );
    }

    if (loading) {
        return <div className="container mt-5">로딩 중...</div>;
    }

    if (error) {
        return <div className="container mt-5 alert alert-danger">{error}</div>;
    }

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>내 문서 목록</h2>
                <Link to="/documents/new" className="btn btn-primary">새 문서 작성</Link>
            </div>
            {documents.length === 0 ? (
                <div className="alert alert-info" role="alert">
                    작성된 문서가 없습니다. 새로운 문서를 작성해보세요!
                </div>
            ) : (
                <div className="list-group">
                    {documents.map((doc) => (
                        <div key={doc.id} className="list-group-item d-flex justify-content-between align-items-center">
                            <Link to={`/documents/edit/${doc.id}`} className="text-decoration-none">
                                <h5>{doc.title || '제목 없음'}</h5>
                                <small className="text-muted">작성자: {doc.authorLoginId}</small>
                            </Link>
                            {user && user.loginId === doc.authorLoginId && (
                                <div>
                                    <Link to={`/documents/edit/${doc.id}`} className="btn btn-sm btn-info me-2">수정</Link>
                                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(doc.id)}>삭제</button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default DocumentList;
