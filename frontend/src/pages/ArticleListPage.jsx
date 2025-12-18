import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { deleteArticle, getArticles } from '../api/article';
import { useAuth } from '../context/AuthContext';

const ArticleListPage = () => {
    const [articles, setArticles] = useState([]);
    const { user, isAdmin } = useAuth();
    const navigate = useNavigate();

    const fetchArticles = async () => {
        try {
            const response = await getArticles();
            setArticles(response.data);
        } catch (error) {
            console.error('게시글 목록을 불러오는 데 실패했습니다.', error);
        }
    };

    useEffect(() => {
        fetchArticles();
    }, []);

    const handleCreate = () => {
        navigate('/articles/new');
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1>게시판</h1>
                {user && (
                    <button className="btn btn-primary" onClick={handleCreate}>
                        새 글 작성
                    </button>
                )}
            </div>
            <ul className="list-group">
                {articles.map((article) => {
                    const isAuthor = user && user.loginId === article.authorLoginId;
                    const canDelete = Boolean(user) && (isAuthor || isAdmin);
                    return (
                        <li key={article.id} className="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <Link to={`/articles/${article.id}`}>
                                    <h5>{article.title}</h5>
                                </Link>
                                <small>by {article.authorNickname || article.authorLoginId} at {new Date(article.createdAt).toLocaleString()}</small>
                            </div>
                            {(isAuthor || canDelete) && (
                                <div>
                                    {isAuthor && (
                                        <Link to={`/articles/edit/${article.id}`} className="btn btn-sm btn-info me-2">수정</Link>
                                    )}
                                    {canDelete && (
                                        <button className="btn btn-sm btn-danger" onClick={async () => {
                                            if (window.confirm('정말로 삭제하시겠습니까?')) {
                                                try {
                                                    await deleteArticle(article.id);
                                                    await fetchArticles();
                                                } catch (error) {
                                                    console.error('게시글 삭제에 실패했습니다.', error);
                                                    alert('게시글 삭제에 실패했습니다. (권한/로그인 상태를 확인하세요)');
                                                }
                                            }
                                        }}>삭제</button>
                                    )}
                                </div>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default ArticleListPage;
