import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ adminOnly }) => {
    const { isAuthenticated, isAdmin } = useAuth();

    if (!isAuthenticated) {
        // 로그인되어 있지 않으면 로그인 페이지로 리디렉션
        return <Navigate to="/login" replace />;
    }

    if (adminOnly && !isAdmin) {
        // 관리자 전용 페이지인데 관리자가 아니면 홈으로 리디렉션
        // 혹은 권한 없음 페이지를 보여줄 수도 있습니다.
        return <Navigate to="/" replace />;
    }

    // 인증되었거나 관리자 전용이 아니거나 관리자면 해당 컴포넌트 렌더링
    return <Outlet />;
};

export default ProtectedRoute;
