import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import {
  IconUser,
  IconMail,
  IconLock,
  IconEye,
  IconEyeOff,
  IconAlertCircle,
  IconArrowRight,
  IconShieldCheck,
  IconTrendingUp,
  IconSparkles,
} from "../Components/Icons";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
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

    if (!form.name.trim() || !form.email.trim() || !form.password) {
      setError("Please fill in all fields.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/register", form);
      login(res.data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create account. Please try again.");
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
            <span>Join TaskFlow Today</span>
          </div>

          <h1 className="auth-hero-title">
            Empower your workflow <br />
            <span className="gradient-span">from day one.</span>
          </h1>

          <p className="auth-hero-desc">
            Experience the clarity of a modern task management dashboard designed for high achievers, focused teams, and daily planners.
          </p>

          <div className="hero-features-list">
            <div className="hero-feature-item">
              <div className="hero-feature-icon">
                <IconTrendingUp size={18} />
              </div>
              <span>Real-time completion rates & productivity tracking</span>
            </div>
            <div className="hero-feature-item">
              <div className="hero-feature-icon">
                <IconShieldCheck size={18} />
              </div>
              <span>Private, secure cloud-synced task workspace</span>
            </div>
          </div>
        </div>

        {/* Right Form Card */}
        <div className="card-auth">
          <div className="auth-header">
            <h2 className="auth-title">Create your account</h2>
            <p className="auth-subtitle">Sign up in seconds and start organizing your tasks</p>
          </div>

          {error && (
            <div className="error-banner">
              <IconAlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="name-input">
                Full Name
              </label>
              <div className="input-icon-wrapper">
                <span className="input-left-icon">
                  <IconUser size={18} />
                </span>
                <input
                  id="name-input"
                  className="custom-input"
                  type="text"
                  name="name"
                  placeholder="e.g. Sarah Jenkins"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

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
                  placeholder="At least 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
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
                  <span>Create Account</span>
                  <IconArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="auth-footer">
            Already have an account?
            <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;