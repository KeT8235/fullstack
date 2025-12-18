import React from 'react';
import './HeaderBar.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
    const { isAuthenticated, logout, user } = useAuth();
    const navigate = useNavigate();

    const handleTaskClick = () => {
        if (isAuthenticated) {
            navigate('/articles/new');
        } else {
            navigate('/login');
        }
    };

    return (
        <header className="header-bar">
            <div className="header-bar__search">
                <input type="text" placeholder="Search tasks..." className="header-bar__search-input" />
            </div>
            <div className="header-bar__right">
                <span className="header-bar__user">
                    <span className="header-bar__avatar">👤</span>
                    {isAuthenticated ? `Welcome, ${user.nickname || user.loginId}` : 'Guest'}
                </span>
                <button className="header-bar__task-btn" onClick={handleTaskClick}>Add Task</button>
                {isAuthenticated ? (
                    <button className="header-bar__logout-btn" onClick={logout}>Logout</button>
                ) : (
                    <>
                        <Link className="header-bar__auth-btn" to="/join">Sign Up</Link>
                        <Link className="header-bar__auth-btn header-bar__auth-btn--primary" to="/login">Login</Link>
                    </>
                )}
            </div>
        </header>
    );
}

export default Navbar;