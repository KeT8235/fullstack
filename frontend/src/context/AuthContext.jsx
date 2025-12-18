import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from "jwt-decode";
import apiClient from '../api/index'; // axios 인스턴스

// 1. AuthContext 생성
const AuthContext = createContext(null);

// 2. AuthProvider 컴포넌트 정의
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null); // { loginId: '...', role: '...' }

    // 컴포넌트 마운트 시 로컬 스토리지에서 토큰 확인
    useEffect(() => {
        const token = localStorage.getItem('jwt-token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                // 토큰 유효성 검사 (예: 만료 시간)
                if (decoded.exp * 1000 > Date.now()) {
                    setIsAuthenticated(true);
                    setUser({ loginId: decoded.loginId, nickname: decoded.nickname, role: decoded.role });
                    // API 클라이언트 헤더 설정은 api.js 인터셉터에서 이미 처리
                } else {
                    localStorage.removeItem('jwt-token'); // 만료된 토큰 제거
                }
            } catch (error) {
                console.error("토큰 디코딩 실패:", error);
                localStorage.removeItem('jwt-token');
            }
        }
    }, []);

    // 로그인 처리
    const login = async (loginId, password) => {
        try {
            const response = await apiClient.post('/api/login', { loginId, password });
            const token = response.data; // 서버에서 토큰을 직접 반환
            localStorage.setItem('jwt-token', token);

            const decoded = jwtDecode(token);
            setIsAuthenticated(true);
            setUser({ loginId: decoded.loginId, nickname: decoded.nickname, role: decoded.role });
            return true; // 로그인 성공
        } catch (error) {
            console.error("로그인 실패:", error);
            setIsAuthenticated(false);
            setUser(null);
            localStorage.removeItem('jwt-token');
            throw error; // 에러를 호출자에게 다시 던짐
        }
    };

    // 로그아웃 처리
    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('jwt-token');
    };

    const isAdmin = user && user.role === 'ROLE_ADMIN';

    const getRoleDisplayName = (role) => {
        switch (role) {
            case 'ROLE_ADMIN':
                return '관리자';
            case 'ROLE_USER':
                return '사용자';
            default:
                return role;
        }
    };

    const authContextValue = {
        isAuthenticated,
        user,
        login,
        logout,
        isAdmin,
        getRoleDisplayName
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};

// 3. AuthContext를 쉽게 사용할 수 있는 커스텀 훅
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
