import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getArticles } from '../api/article';
import './DashboardMain.css';

const formatDateTime = (value) => {
  if (!value) {
    return '';
  }
  try {
    const date = new Date(value);
    return new Intl.DateTimeFormat('ko-KR', {
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  } catch (error) {
    return value;
  }
};

const formatDate = (value) => {
  if (!value) {
    return '';
  }
  try {
    const date = new Date(value);
    return new Intl.DateTimeFormat('ko-KR', {
      month: 'long',
      day: 'numeric'
    }).format(date);
  } catch (error) {
    return value;
  }
};

const buildCalendar = (items) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const tasksByDay = items.reduce((acc, item) => {
    const created = new Date(item.createdAt);
    if (created.getFullYear() === year && created.getMonth() === month) {
      const day = created.getDate();
      acc[day] = (acc[day] || 0) + 1;
    }
    return acc;
  }, {});

  const cells = [];
  for (let i = 0; i < firstDay; i += 1) {
    cells.push(null);
  }
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({
      day,
      count: tasksByDay[day] || 0
    });
  }
  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  const monthLabel = new Intl.DateTimeFormat('ko-KR', { month: 'long' }).format(new Date(year, month, 1));

  return {
    monthLabel,
    year,
    weeks
  };
};

function DashboardMain() {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, user } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    const fetchArticles = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await getArticles();
        if (mounted) {
          const sorted = Array.isArray(data)
            ? [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            : [];
          setArticles(sorted);
        }
      } catch (err) {
        if (mounted) {
          console.error('게시글 데이터를 불러오는 데 실패했습니다.', err);
          setError('게시글 데이터를 불러오지 못했습니다.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchArticles();

    return () => {
      mounted = false;
    };
  }, []);

  const handleAddTask = () => {
    if (isAuthenticated) {
      navigate('/articles/new');
    } else {
      navigate('/login');
    }
  };

  const handleViewAll = () => {
    navigate('/articles');
  };

  const handleOpenTask = (id) => {
    navigate(`/articles/${id}`);
  };

  const handleAdminConsole = () => {
    navigate('/admin');
  };

  const weekAgo = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date;
  }, []);

  const articlesThisWeek = useMemo(
    () => articles.filter((article) => new Date(article.createdAt) >= weekAgo).length,
    [articles, weekAgo]
  );

  const completionRate = useMemo(() => {
    if (articles.length === 0) {
      return 0;
    }
    return Math.min(100, Math.round((articlesThisWeek / articles.length) * 100));
  }, [articles.length, articlesThisWeek]);

  const nextDeadline = articles[0];
  const nextSprint = articles[1];
  const recentTasks = articles.slice(0, 3);
  const upcomingTasks = articles.slice(3, 6);
  const calendar = useMemo(() => buildCalendar(articles), [articles]);

  return (
    <div className="dashboard-main">
      <div className="dashboard-main__welcome">
        <h2>{`Welcome back, ${user ? user.loginId : 'Guest'}`}</h2>
        <p>최근 게시글 데이터를 기준으로 업무 현황을 정리했습니다.</p>
        <button className="dashboard-main__add-task" onClick={handleAddTask}>
          Add Task
        </button>
        <div className="dashboard-main__cards">
          <div className="dashboard-main__card">
            <div className="dashboard-main__card-title">Next up</div>
            <div className="dashboard-main__card-desc">
              {nextDeadline ? nextDeadline.title : '게시글이 없습니다.'}
            </div>
            <div className="dashboard-main__card-team">
              {nextDeadline ? formatDate(nextDeadline.createdAt) : '작성 후 자동 표시됩니다.'}
            </div>
          </div>
          <div className="dashboard-main__card">
            <div className="dashboard-main__card-title">최근 일주일</div>
            <div className="dashboard-main__card-desc">{articlesThisWeek}건 작성</div>
            <div className="dashboard-main__card-team">전체 {articles.length}건</div>
          </div>
        </div>
      </div>

      <div className="dashboard-main__stats-row">
        <div className="dashboard-main__circle-card">
          <div className="dashboard-main__circle" aria-label="이번 주 작성 비율">
            <span>{completionRate}%</span>
          </div>
          <div className="dashboard-main__circle-label">이번 주 작성 비율</div>
        </div>
        <button className="dashboard-main__info-card" type="button" onClick={handleViewAll}>
          전체 게시글 보기
        </button>
        <button className="dashboard-main__info-card" type="button" onClick={handleAddTask}>
          새 게시글 작성
        </button>
        {isAdmin && (
          <button className="dashboard-main__info-card" type="button" onClick={handleAdminConsole}>
            관리자 콘솔
          </button>
        )}
      </div>

      <div className="dashboard-main__tasks-calendar-row">
        <div className="dashboard-main__tasks">
          <div className="dashboard-main__section-header">
            <h3>Your Tasks</h3>
            <button className="dashboard-main__link" type="button" onClick={handleViewAll}>
              전체 보기
            </button>
          </div>
          {loading && <div className="dashboard-main__placeholder">게시글을 불러오는 중입니다...</div>}
          {error && <div className="dashboard-main__error">{error}</div>}
          {!loading && !error && (
            <div className="dashboard-main__task-list">
              {recentTasks.length === 0 && (
                <div className="dashboard-main__placeholder">표시할 게시글이 없습니다.</div>
              )}
              {recentTasks.map((task) => (
                <button
                  key={task.id}
                  type="button"
                  className="dashboard-main__task-item"
                  onClick={() => handleOpenTask(task.id)}
                >
                  <span className="dashboard-main__task-avatar">🗂️</span>
                  <span className="dashboard-main__task-title">{task.title}</span>
                  <span className="dashboard-main__task-description">{task.author}</span>
                  <span className="dashboard-main__task-meta">{formatDateTime(task.createdAt)}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="dashboard-main__calendar">
          <h3>{`${calendar.year}년 ${calendar.monthLabel}`}</h3>
          <div className="dashboard-main__calendar-grid">
            <div className="dashboard-main__calendar-row dashboard-main__calendar-header">
              <span>일</span>
              <span>월</span>
              <span>화</span>
              <span>수</span>
              <span>목</span>
              <span>금</span>
              <span>토</span>
            </div>
            {calendar.weeks.map((week, index) => (
              <div key={`week-${index}`} className="dashboard-main__calendar-row">
                {week.map((cell, cellIdx) => (
                  <span
                    key={`cell-${cellIdx}`}
                    className={`dashboard-main__calendar-day${cell && cell.count > 0 ? ' dashboard-main__calendar-day--has-task' : ''}`}
                  >
                    {cell ? (
                      <>
                        <span>{cell.day}</span>
                        {cell.count > 0 && <small>{cell.count}</small>}
                      </>
                    ) : (
                      ''
                    )}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-main__upcoming">
          <div className="dashboard-main__section-header">
            <h3>Upcoming tasks</h3>
          </div>
          {loading && <div className="dashboard-main__placeholder">게시글을 불러오는 중입니다...</div>}
          {error && <div className="dashboard-main__error">{error}</div>}
          {!loading && !error && (
            <div className="dashboard-main__upcoming-list">
              {upcomingTasks.length === 0 && (
                <div className="dashboard-main__placeholder">예정된 게시글이 없습니다.</div>
              )}
              {upcomingTasks.map((task) => (
                <button
                  key={task.id}
                  type="button"
                  className="dashboard-main__upcoming-item"
                  onClick={() => handleOpenTask(task.id)}
                >
                  <span className="dashboard-main__upcoming-label">{task.title}</span>
                  <span>{task.author}</span>
                  <span>{formatDateTime(task.createdAt)}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="dashboard-main__stats">
        <h3>Daily productivity stats</h3>
        <div className="dashboard-main__stats-metrics">
          <div className="dashboard-main__metric">
            <span className="dashboard-main__metric-label">전체 게시글</span>
            <strong className="dashboard-main__metric-value">{articles.length}</strong>
          </div>
          <div className="dashboard-main__metric">
            <span className="dashboard-main__metric-label">이번 주 작성</span>
            <strong className="dashboard-main__metric-value">{articlesThisWeek}</strong>
          </div>
          <div className="dashboard-main__metric">
            <span className="dashboard-main__metric-label">최근 게시글</span>
            <strong className="dashboard-main__metric-value">
              {articles[0] ? formatDateTime(articles[0].createdAt) : '-'}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardMain;
