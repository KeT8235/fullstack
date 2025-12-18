import React, { useState } from 'react';
import apiClient from '../api/index';
import { useNavigate } from 'react-router-dom';

function JoinPage() {
    const [loginId, setLoginId] = useState('');
    const [password, setPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        try {
            // API 요청 시 role 필드 제거
            await apiClient.post('/api/join', {
                loginId,
                password,
                nickname
            });
            alert('회원가입 성공!');
            navigate('/login'); // 회원가입 성공 후 로그인 페이지로 이동
        } catch (error) {
            const status = error.response?.status;
            const message = error.response?.data?.message || error.response?.data || error.message;

            if (status === 409) {
                setErrorMessage(message || '이미 사용 중인 정보입니다. 다른 값을 입력해주세요.');
            } else if (status === 400) {
                setErrorMessage(message || '입력값을 확인해주세요.');
            } else {
                setErrorMessage('회원가입 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
            }
            console.error('회원가입 에러:', error);
        }
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-white">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-11 col-sm-8 col-md-6 col-lg-4">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body p-4">
                                <div className="d-flex align-items-center justify-content-center mb-4">
                                    <span className="me-2" aria-hidden="true">≡</span>
                                    <h5 className="mb-0">Productivity Hub</h5>
                                </div>

                                {errorMessage && (
                                    <div className="alert alert-danger" role="alert">
                                        {errorMessage}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="loginId"
                                            placeholder="Username"
                                            aria-label="Username"
                                            value={loginId}
                                            onChange={(e) => setLoginId(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="password"
                                            placeholder="Password"
                                            aria-label="Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="nickname"
                                            placeholder="Name"
                                            aria-label="Name"
                                            value={nickname}
                                            onChange={(e) => setNickname(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <button type="submit" className="btn btn-dark w-100">Sign up</button>

                                    <a
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            navigate('/login');
                                        }}
                                        className="d-block text-center mt-3 text-decoration-none text-muted"
                                    >
                                        Back to Login
                                    </a>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default JoinPage;
