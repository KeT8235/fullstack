import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';
import { useAuth } from '../context/AuthContext';

function Sidebar() {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar__profile">
        <span className="sidebar__avatar">👤</span>
      </div>
      <nav className="sidebar__nav">
        <ul>
          <li><Link to="/">Dashboard</Link></li>
          {isAuthenticated && <li><Link to="/my-page">My Page</Link></li>}
          <li><Link to="/articles">Articles</Link></li>
          {isAuthenticated && <li><Link to="/my-documents">Documents</Link></li>}
          {isAdmin && <li><Link to="/admin">Admin Console</Link></li>}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
