import React, { useState, useEffect } from 'react';
import MarkdownPreview from '@uiw/react-markdown-preview';
import '@uiw/react-markdown-preview/markdown.css';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getArticle, deleteArticle } from '../api/article';
import { useAuth } from '../context/AuthContext';

const ArticleDetailPage = () => {
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    const { user, isAdmin } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const response = await getArticle(id);
                setArticle(response.data);
            } catch (error) {
                console.error('게시글을 불러오는 데 실패했습니다.', error);
                navigate('/articles'); // 게시글이 없으면 목록으로 리디렉션
            }
        };
        fetchArticle();
    }, [id, navigate]);

    const handleDelete = async () => {
        if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
            try {
                await deleteArticle(id);
                navigate('/articles');
            } catch (error) {
                console.error('게시글 삭제에 실패했습니다.', error);
                alert('게시글 삭제 권한이 없습니다.');
            }
        }
    };

    if (!article) {
        return <div>로딩 중...</div>;
    }

    const isAuthor = user && user.loginId === article.authorLoginId;
    const canManage = isAuthor || isAdmin;

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-start gap-3">
                <div>
                    <h1 className="mb-1">{article.title}</h1>
                    <div className="text-muted small">
                        작성자: {article.authorNickname || article.authorLoginId} · 작성일: {new Date(article.createdAt).toLocaleString()} · 수정일: {new Date(article.updatedAt).toLocaleString()}
                    </div>
                </div>
                {canManage && (
                    <div className="d-flex gap-2 flex-shrink-0">
                        <Link to={`/articles/edit/${id}`} className="btn btn-outline-secondary">
                            수정
                        </Link>
                        <button className="btn btn-danger" onClick={handleDelete}>
                            삭제
                        </button>
                    </div>
                )}
            </div>

            <div className="card mt-3 border-0 shadow-sm">
                <div className="card-body">
                    <MarkdownPreview className="markdown-body" source={article.content || ''} />
                </div>
            </div>
        </div>
    );
};

export default ArticleDetailPage;
