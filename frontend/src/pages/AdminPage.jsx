import React, { useEffect, useState } from 'react';
import apiClient from '../api';
import { useAuth } from '../context/AuthContext';

function AdminPage() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const { getRoleDisplayName } = useAuth();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await apiClient.get('/api/admin/users');
                setUsers(response.data);
            } catch (err) {
                setError('사용자 목록을 불러오는 데 실패했습니다. 권한을 확인해주세요.');
                console.error(err);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className="container mt-5">
            <h2>관리자 페이지 - 사용자 관리</h2>
            <p>시스템에 등록된 모든 사용자 목록입니다.</p>

            {error && <div className="alert alert-danger">{error}</div>}

            <table className="table table-striped table-hover">
                <thead className="table-dark">
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">아이디</th>
                        <th scope="col">닉네임</th>
                        <th scope="col">역할</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <th scope="row">{user.id}</th>
                            <td>{user.loginId}</td>
                            <td>{user.nickname}</td>
                            <td>{getRoleDisplayName(user.role)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdminPage;