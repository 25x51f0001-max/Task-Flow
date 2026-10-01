import { useEffect, useState, useMemo } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import TaskForm from "../Components/TaskForm";
import TaskItem from "../Components/TaskItem";
import {
  IconListTodo,
  IconClock,
  IconCheckCircle,
  IconTrendingUp,
  IconSearch,
  IconClose,
  IconCalendar,
  IconAlertCircle,
  IconSparkles,
} from "../Components/Icons";

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // 'all' | 'active' | 'completed'

  const loadTasks = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load tasks from server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleAdd = async (data) => {
    try {
      const res = await api.post("/tasks", data);
      setTasks((prev) => [res.data, ...prev]);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create task");
    }
  };

  const handleToggle = async (task) => {
    try {
      const res = await api.put(`/tasks/${task._id}`, { completed: !task.completed });
      setTasks((prev) => prev.map((t) => (t._id === task._id ? res.data : t)));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update task status");
    }
  };

  const handleUpdate = async (id, updatedFields) => {
    try {
      const res = await api.put(`/tasks/${id}`, updatedFields);
      setTasks((prev) => prev.map((t) => (t._id === id ? res.data : t)));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update task");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete task");
    }
  };

  // Time of day greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Formatted date string
  const currentDate = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  // Calculate statistics
  const totalCount = tasks.length;
  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = totalCount - completedCount;
  const completionRate = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  // Filter & Search tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Filter by status
      if (filterStatus === "active" && task.completed) return false;
      if (filterStatus === "completed" && !task.completed) return false;

      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const titleMatch = task.title.toLowerCase().includes(query);
        const descMatch = (task.description || "").toLowerCase().includes(query);
        return titleMatch || descMatch;
      }

      return true;
    });
  }, [tasks, filterStatus, searchQuery]);

  if (loading) {
    return (
      <div className="container page-loading-wrapper">
        <div className="page-spinner" />
        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
          Loading your workspace...
        </p>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Dashboard Top Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="greeting-title">
            {getGreeting()}, {user?.name || "Workspace"} 👋
          </h1>
          <p className="greeting-subtitle">
            Here is your productivity overview for today.
          </p>
        </div>

        <div className="date-pill">
          <IconCalendar size={16} />
          <span>{currentDate}</span>
        </div>
      </div>

      {/* Global Error Banner if any */}
      {error && (
        <div className="error-banner">
          <IconAlertCircle size={18} />
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError("")}
            style={{ marginLeft: "auto", background: "none", border: "none", color: "inherit", cursor: "pointer" }}
          >
            <IconClose size={14} />
          </button>
        </div>
      )}

      {/* Stats Cards Row */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Total Tasks</span>
            <div className="stat-icon total">
              <IconListTodo size={18} />
            </div>
          </div>
          <div className="stat-value">{totalCount}</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">In Progress</span>
            <div className="stat-icon pending">
              <IconClock size={18} />
            </div>
          </div>
          <div className="stat-value">{pendingCount}</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Completed</span>
            <div className="stat-icon completed">
              <IconCheckCircle size={18} />
            </div>
          </div>
          <div className="stat-value">{completedCount}</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Completion Rate</span>
            <div className="stat-icon rate">
              <IconTrendingUp size={18} />
            </div>
          </div>
          <div>
            <div className="stat-value">{completionRate}%</div>
            <div className="progress-bar-container">
              <div
                className="progress-bar-fill"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Responsive Dashboard Layout */}
      <div className="dashboard-layout">
        {/* Left column: Sticky Task Form */}
        <TaskForm onAdd={handleAdd} />

        {/* Right column: Task List & Toolbar */}
        <div className="tasks-container">
          {/* Search & Filter Toolbar */}
          <div className="toolbar-card">
            <div className="search-input-wrapper">
              <span className="search-icon">
                <IconSearch size={16} />
              </span>
              <input
                className="search-input"
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="clear-search-btn"
                  onClick={() => setSearchQuery("")}
                  title="Clear search"
                >
                  <IconClose size={14} />
                </button>
              )}
            </div>

            <div className="filter-pills">
              <button
                type="button"
                className={`filter-pill ${filterStatus === "all" ? "active" : ""}`}
                onClick={() => setFilterStatus("all")}
              >
                <span>All</span>
                <span className="filter-count">{totalCount}</span>
              </button>
              <button
                type="button"
                className={`filter-pill ${filterStatus === "active" ? "active" : ""}`}
                onClick={() => setFilterStatus("active")}
              >
                <span>Active</span>
                <span className="filter-count">{pendingCount}</span>
              </button>
              <button
                type="button"
                className={`filter-pill ${filterStatus === "completed" ? "active" : ""}`}
                onClick={() => setFilterStatus("completed")}
              >
                <span>Done</span>
                <span className="filter-count">{completedCount}</span>
              </button>
            </div>
          </div>

          {/* Task Items List */}
          {filteredTasks.length === 0 ? (
            <div className="empty-state-card">
              <div className="empty-state-icon">
                {searchQuery ? <IconSearch size={28} /> : <IconSparkles size={28} />}
              </div>
              <h4 className="empty-state-title">
                {searchQuery
                  ? "No matching tasks found"
                  : filterStatus === "completed"
                  ? "No completed tasks yet"
                  : filterStatus === "active"
                  ? "All caught up!"
                  : "No tasks in your workspace"}
              </h4>
              <p className="empty-state-desc">
                {searchQuery
                  ? `We couldn't find anything matching "${searchQuery}". Try a different keyword.`
                  : filterStatus === "completed"
                  ? "Mark items as done to see them listed here."
                  : "Start by creating a new task using the form on the left."}
              </p>
              {searchQuery && (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setSearchQuery("")}
                >
                  Clear Search Filter
                </button>
              )}
            </div>
          ) : (
            filteredTasks.map((task) => (
              <TaskItem
                key={task._id}
                task={task}
                onToggle={handleToggle}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;