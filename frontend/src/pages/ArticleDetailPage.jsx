import React, { useState, useEffect } from 'react';
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

    const isAuthor = user && user.loginId === article.author;
    const canManage = isAuthor || isAdmin;

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center">
                <h1>{article.title}</h1>
                {canManage && (
                    <div>
                        <Link to={`/articles/edit/${id}`} className="btn btn-secondary me-2">
                            수정
                        </Link>
                        <button className="btn btn-danger" onClick={handleDelete}>
                            삭제
                        </button>
                    </div>
                )}
            </div>
            <p className="text-muted">
                작성자: {article.author} | 작성일: {new Date(article.createdAt).toLocaleString()} | 수정일: {new Date(article.updatedAt).toLocaleString()}
            </p>
            <hr />
            <div style={{ whiteSpace: 'pre-wrap' }}>{article.content}</div>
        </div>
    );
};

export default ArticleDetailPage;
