import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Quill 에디터 스타일
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../api/index';

function DocumentEditor() {
    const { id } = useParams(); // 문서 ID (수정 모드일 경우)
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 수정 모드일 경우, 기존 문서 정보 불러오기
    useEffect(() => {
        if (id) {
            const fetchDocument = async () => {
                setLoading(true);
                try {
                    const response = await apiClient.get(`/api/documents/${id}`);
                    setTitle(response.data.title);
                    setContent(response.data.content);
                } catch (err) {
                    console.error('문서 불러오기 실패:', err);
                    setError('문서를 불러오는 데 실패했습니다.');
                } finally {
                    setLoading(false);
                }
            };
            fetchDocument();
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const documentData = { title, content };

        try {
            if (id) {
                // 수정 모드
                await apiClient.put(`/api/documents/${id}`, documentData);
                alert('문서가 성공적으로 수정되었습니다!');
            } else {
                // 생성 모드
                await apiClient.post('/api/documents', documentData);
                alert('문서가 성공적으로 생성되었습니다!');
            }
            navigate('/my-documents'); // 문서 목록 페이지로 이동
        } catch (err) {
            console.error('문서 저장 실패:', err);
            setError('문서 저장에 실패했습니다: ' + (err.response?.data || err.message));
        } finally {
            setLoading(false);
        }
    };

    if (loading && id) { // 수정 모드에서 로딩 중일 때
        return <div className="container mt-5">문서 로딩 중...</div>;
    }

    if (error) {
        return <div className="container mt-5 alert alert-danger">{error}</div>;
    }

    return (
        <div className="container mt-5">
            <h2>{id ? '문서 수정' : '새 문서 작성'}</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">제목</label>
                    <input
                        type="text"
                        className="form-control"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">내용</label>
                    <ReactQuill theme="snow" value={content} onChange={setContent} />
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? '저장 중...' : (id ? '문서 수정' : '문서 생성')}
                </button>
                <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate('/my-documents')}>
                    취소
                </button>
            </form>
        </div>
    );
}

export default DocumentEditor;
