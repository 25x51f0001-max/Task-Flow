import { Link } from "react-router-dom";
import { IconArrowRight, IconSparkles } from "../Components/Icons";

const NotFound = () => (
  <div className="container" style={{ textAlign: "center", paddingTop: 80 }}>
    <div
      className="hero-feature-icon"
      style={{ width: 64, height: 64, margin: "0 auto 20px" }}
    >
      <IconSparkles size={32} />
    </div>
    <h1 style={{ fontSize: "3rem", fontWeight: 800, marginBottom: 8 }}>404</h1>
    <h2 style={{ fontSize: "1.4rem", fontWeight: 600, marginBottom: 16 }}>
      Page not found
    </h2>
    <p style={{ color: "var(--text-secondary)", marginBottom: 28, maxWidth: 400, margin: "0 auto 28px" }}>
      The page you're looking for doesn't exist or has been moved to another URL.
    </p>
    <Link to="/" className="btn-primary" style={{ display: "inline-flex", width: "auto", padding: "0 24px" }}>
      <span>Return to Dashboard</span>
      <IconArrowRight size={16} />
    </Link>
  </div>
);

export default NotFound;