import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/index';
import { useAuth } from '../context/AuthContext';
import MDEditor from '@uiw/react-md-editor';

function DocumentEditorPage() {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();
    const isEditing = Boolean(id);

    useEffect(() => {
        if (!user) {
            alert('로그인이 필요합니다.');
            navigate('/login');
            return;
        }
        if (isEditing) {
            apiClient.get(`/api/documents/${id}`)
                .then(res => {
                    setTitle(res.data.title);
                    setContent(res.data.content);
                })
                .catch(() => {
                    alert('문서를 불러올 수 없습니다.');
                    navigate('/documents');
                });
        }
    }, [id, isEditing, user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) {
            alert('제목과 내용을 모두 입력해주세요.');
            return;
        }
        try {
            if (isEditing) {
                await apiClient.put(`/api/documents/${id}`, { title, content });
            } else {
                await apiClient.post('/api/documents', { title, content });
            }
            navigate('/documents');
        } catch (err) {
            alert('저장에 실패했습니다.');
        }
    };

    return (
        <div className="container mt-4">
            <h1>{isEditing ? '문서 수정' : '새 문서 작성'}</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">제목</label>
                    <input
                        type="text"
                        className="form-control"
                        id="title"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="content" className="form-label">내용 (마크다운 지원)</label>
                    <div data-color-mode="light">
                        <MDEditor value={content} onChange={setContent} height={400} />
                    </div>
                </div>
                <button type="submit" className="btn btn-primary">{isEditing ? '수정하기' : '작성하기'}</button>
            </form>
        </div>
    );
}

export default DocumentEditorPage;
