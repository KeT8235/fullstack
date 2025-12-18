import React, { useState, useEffect } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { useParams, useNavigate } from 'react-router-dom';
import { getArticle, createArticle, updateArticle } from '../api/article';
import { useAuth } from '../context/AuthContext';

const ArticleEditorPage = () => {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const { user, isAdmin } = useAuth();
    const navigate = useNavigate();
    const isEditing = Boolean(id);

    useEffect(() => {
        if (!user) {
            alert('로그인이 필요합니다.');
            navigate('/login');
            return;
        }

        if (isEditing) {
            const fetchArticle = async () => {
                try {
                    const response = await getArticle(id);
                    const article = response.data;
                    if (!isAdmin && user.loginId !== article.authorLoginId) {
                        alert('수정 권한이 없습니다.');
                        navigate(`/articles/${id}`);
                    } else {
                        setTitle(article.title);
                        setContent(article.content);
                    }
                } catch (error) {
                    console.error('게시글을 불러오는 데 실패했습니다.', error);
                    navigate('/articles');
                }
            };
            fetchArticle();
        }
    }, [id, isEditing, user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) {
            alert('제목과 내용을 모두 입력해주세요.');
            return;
        }

        const articleData = { title, content };

        try {
            let savedArticle;
            if (isEditing) {
                savedArticle = await updateArticle(id, articleData);
            } else {
                savedArticle = await createArticle(articleData);
            }
            navigate(`/articles/${savedArticle.data.id}`);
        } catch (error) {
            console.error('게시글 저장에 실패했습니다.', error);
            alert('게시글 저장 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="container mt-4">
            <h1>{isEditing ? '게시글 수정' : '새 글 작성'}</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                        제목
                    </label>
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
                    <label htmlFor="content" className="form-label">
                        내용 (마크다운 지원)
                    </label>
                    <div data-color-mode="light">
                        <MDEditor
                            value={content}
                            onChange={setContent}
                            height={400}
                        />
                    </div>
                </div>
                <button type="submit" className="btn btn-primary">
                    {isEditing ? '수정하기' : '작성하기'}
                </button>
            </form>
        </div>
    );
};

export default ArticleEditorPage;
