import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/index';
import MarkdownPreview from '@uiw/react-markdown-preview';
import '@uiw/react-markdown-preview/markdown.css';
import { useAuth } from '../context/AuthContext';

function DocumentDetailPage() {
    const { id } = useParams();
    const [document, setDocument] = useState(null);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        apiClient.get(`/api/documents/${id}`)
            .then(res => setDocument(res.data))
            .catch(() => {
                alert('문서를 불러올 수 없습니다.');
                navigate('/documents');
            });
    }, [id, navigate]);

    if (!document) return <div>로딩 중...</div>;

    const isAuthor = user && user.loginId === document.authorLoginId;

    return (
        <div className="container mt-4">
            <h1 className="mb-1">{document.title}</h1>
            <div className="text-muted small">작성자: {document.authorLoginId}</div>

            <div className="card mt-3 border-0 shadow-sm">
                <div className="card-body">
                    <MarkdownPreview className="markdown-body" source={document.content || ''} />
                </div>
            </div>
            {isAuthor && (
                <div className="mt-3">
                    <button className="btn btn-info me-2" onClick={() => navigate(`/documents/edit/${id}`)}>수정</button>
                    <button className="btn btn-danger" onClick={async () => {
                        if (window.confirm('정말로 삭제하시겠습니까?')) {
                            await apiClient.delete(`/api/documents/${id}`);
                            navigate('/documents');
                        }
                    }}>삭제</button>
                </div>
            )}
        </div>
    );
}

export default DocumentDetailPage;
