import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getArticles } from '../api/article';
import { useAuth } from '../context/AuthContext';

const ArticleListPage = () => {
    const [articles, setArticles] = useState([]);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await getArticles();
                setArticles(response.data);
            } catch (error) {
                console.error('게시글 목록을 불러오는 데 실패했습니다.', error);
            }
        };
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
                {articles.map((article) => (
                    <li key={article.id} className="list-group-item">
                        <Link to={`/articles/${article.id}`}>
                            <h5>{article.title}</h5>
                        </Link>
                        <small>by {article.author} at {new Date(article.createdAt).toLocaleString()}</small>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ArticleListPage;
