import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import {
  IconMail,
  IconLock,
  IconEye,
  IconEyeOff,
  IconAlertCircle,
  IconArrowRight,
  IconShieldCheck,
  IconTrendingUp,
  IconCheck,
  IconSparkles,
} from "../Components/Icons";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) {
      setError("Please fill in both email and password.");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/auth/login", form);
      login(res.data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = async () => {
    const demoData = { email: "alex.workspace@taskflow.dev", password: "Password123!" };
    setForm(demoData);
    setError("");
    // Try to auto-login or register if it doesn't exist
    setLoading(true);
    try {
      const res = await api.post("/auth/login", demoData);
      login(res.data);
      navigate("/dashboard");
    } catch {
      // If user doesn't exist, create demo account automatically!
      try {
        const regRes = await api.post("/auth/register", {
          name: "Alex Morgan",
          email: demoData.email,
          password: demoData.password,
        });
        login(regRes.data);
        navigate("/dashboard");
      } catch (regErr) {
        setError(regErr.response?.data?.message || "Could not auto-login with demo account. Please register.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container container-auth">
      <div className="auth-grid">
        {/* Left Hero Side */}
        <div className="auth-hero-side">
          <div className="hero-pill">
            <IconSparkles size={14} />
            <span>Next-Generation Productivity</span>
          </div>

          <h1 className="auth-hero-title">
            Focus on what matters. <br />
            <span className="gradient-span">Accomplish more.</span>
          </h1>

          <p className="auth-hero-desc">
            Organize tasks seamlessly, track your daily momentum, and achieve your goals with an ultra-clean, distraction-free interface.
          </p>

          <div className="hero-features-list">
            <div className="hero-feature-item">
              <div className="hero-feature-icon">
                <IconTrendingUp size={18} />
              </div>
              <span>Real-time completion metrics & productivity tracking</span>
            </div>
            <div className="hero-feature-item">
              <div className="hero-feature-icon">
                <IconShieldCheck size={18} />
              </div>
              <span>Encrypted token authentication for total privacy</span>
            </div>
          </div>

          {/* Micro Preview Card */}
          <div className="hero-preview-card">
            <div className="preview-task-info">
              <div className="preview-check">
                <IconCheck size={14} />
              </div>
              <div>
                <div className="preview-title">Launch Q4 Performance Goals</div>
                <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Completed today at 10:45 AM</div>
              </div>
            </div>
            <span className="preview-badge">High Priority</span>
          </div>
        </div>

        {/* Right Form Card */}
        <div className="card-auth">
          <div className="auth-header">
            <h2 className="auth-title">Welcome back</h2>
            <p className="auth-subtitle">Enter your credentials to continue to your dashboard</p>
          </div>

          <button
            type="button"
            className="demo-pill-btn"
            onClick={handleFillDemo}
            disabled={loading}
          >
            <IconSparkles size={15} />
            <span>⚡ One-Click Demo Login</span>
          </button>

          {error && (
            <div className="error-banner">
              <IconAlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="email-input">
                Email Address
              </label>
              <div className="input-icon-wrapper">
                <span className="input-left-icon">
                  <IconMail size={18} />
                </span>
                <input
                  id="email-input"
                  className="custom-input"
                  type="email"
                  name="email"
                  placeholder="name@company.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password-input">
                Password
              </label>
              <div className="input-icon-wrapper">
                <span className="input-left-icon">
                  <IconLock size={18} />
                </span>
                <input
                  id="password-input"
                  className="custom-input"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  style={{ paddingRight: "46px" }}
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (
                <div className="spinner" />
              ) : (
                <>
                  <span>Sign In to TaskFlow</span>
                  <IconArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="auth-footer">
            Don't have an account?
            <Link to="/register">Create an account</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;