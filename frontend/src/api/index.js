import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8080' // Spring Boot 백엔드 API 기본 URL
});

// 요청 인터셉터: 모든 요청이 보내지기 전에 실행되어 Authorization 헤더에 JWT 추가
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwt-token'); // localStorage에서 토큰 가져오기
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`; // 토큰이 있으면 헤더에 추가
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 응답 인터셉터: API 응답 처리 (예: 401 Unauthorized 시 로그인 페이지로 리디렉션)
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // 토큰 만료 또는 유효하지 않은 경우
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('jwt-token'); // 만료된 토큰 삭제
            window.location.href = '/login'; // 로그인 페이지로 리디렉션
        }
        return Promise.reject(error);
    }
);

export default apiClient;
