import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
    const [loginId, setLoginId] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(loginId, password);
            alert('로그인 성공!');
            navigate('/'); // 로그인 성공 후 홈으로 이동
        } catch (error) {
            // 에러 메시지는 api.js 인터셉터에서 이미 처리했거나, 여기서 더 상세히 보여줄 수 있음
            alert('로그인 실패: 아이디 또는 비밀번호를 확인해주세요.');
            console.error('로그인 에러:', error);
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

                                    <button type="submit" className="btn btn-dark w-100">Login</button>

                                    <a
                                        href="#"
                                        onClick={(e) => e.preventDefault()}
                                        className="d-block text-center mt-3 text-decoration-none text-muted"
                                    >
                                        Forgot Password?
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

export default LoginPage;
