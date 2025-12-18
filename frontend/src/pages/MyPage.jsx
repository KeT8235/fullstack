import React from 'react';
import { useAuth } from '../context/AuthContext';

function MyPage() {
    const { user, getRoleDisplayName } = useAuth();

    return (
        <div className="container mt-5">
            <div className="card">
                <div className="card-header">마이 페이지</div>
                <div className="card-body">
                    {user ? (
                        <>
                            <h5 className="card-title">환영합니다, {user.nickname || user.loginId}님!</h5>
                            <p className="card-text">당신의 역할: {getRoleDisplayName(user.role)}</p>
                            <p className="card-text">이곳은 로그인한 사용자만 접근할 수 있습니다.</p>
                        </>
                    ) : (
                        <p className="card-text">사용자 정보를 불러올 수 없습니다.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MyPage;
