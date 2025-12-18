import apiClient from './index';

export const getArticles = () => {
    return apiClient.get('/api/articles');
};

export const getArticle = (id) => {
    return apiClient.get(`/api/articles/${id}`);
};

export const createArticle = (articleData) => {
    return apiClient.post('/api/articles', articleData);
};

export const updateArticle = (id, articleData) => {
    return apiClient.put(`/api/articles/${id}`, articleData);
};

export const deleteArticle = (id) => {
    return apiClient.delete(`/api/articles/${id}`);
};
