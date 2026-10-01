import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { IconLogo, IconSun, IconMoon, IconLogOut, IconSparkles } from "./Icons";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header className="navbar-wrapper">
      <div className="navbar-inner">
        <Link to="/" className="nav-brand">
          <IconLogo size={32} />
          <div className="nav-brand-title">
            <span className="nav-brand-text">TaskFlow</span>
            <span className="nav-badge">Workspace</span>
          </div>
        </Link>

        <div className="nav-actions">
          {/* Theme switcher */}
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            aria-label="Toggle color theme"
          >
            {theme === "dark" ? <IconSun size={19} /> : <IconMoon size={19} />}
          </button>

          {user ? (
            <>
              <div className="user-badge">
                <div className="avatar-circle">{getInitials(user.name)}</div>
                <span>{user.name}</span>
              </div>
              <button
                type="button"
                className="btn-secondary"
                onClick={handleLogout}
                title="Sign out"
              >
                <IconLogOut size={16} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost">
                Sign in
              </Link>
              <Link to="/register" className="btn-nav-primary">
                <IconSparkles size={15} />
                <span>Get Started</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;