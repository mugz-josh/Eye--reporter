import React from "react";
import { useNavigate } from "react-router-dom";
import "../components/ui/styles/components.css";

// Import icons from lucide-react
import { Shield, Activity, Users, Flag, FileText, CheckCircle, ArrowRight, User, AlertCircle } from "lucide-react";

const Homepage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">Trusted by 10,000+ Citizens</div>
          <h1>Empower Your Voice, Drive Change in Your Community</h1>
          <p>
            Report corruption, unethical practices, and infrastructure issues directly to authorities. Join
            thousands of citizens making Africa more transparent and accountable.
          </p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={() => navigate("/login")}>
              Sign In
            </button>
            <button className="btn-secondary" onClick={() => console.log("Learn More clicked")}>
              Learn More
            </button>
          </div>
          <div className="hero-features">
            <div className="feature">
              <Shield className="feature-icon" /> Secure & Anonymous
            </div>
            <div className="feature">
              <Activity className="feature-icon" /> Real-time Tracking
            </div>
            <div className="feature">
              <Users className="feature-icon" /> Community Driven
            </div>
          </div>
        </div>
      </section>

      {/* Cards Section */}
      <section className="cards-section">
        <div className="cards-container">
          <div className="card">
            <Flag className="card-icon" />
            <h3>RedFlag Reports</h3>
            <p>Submit reports on corruption, unethical behavior, or urgent public issues.</p>
          </div>
          <div className="card">
            <FileText className="card-icon" />
            <h3>Intervention Requests</h3>
            <p>Request support for community or infrastructure challenges.</p>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="process-section">
        <h2>A Simple Transparent Process</h2>
        <div className="process-steps">
          {["Create", "Submit", "Track", "See Changes"].map((step, index) => (
            <div key={index} className="step">
              <div className="step-circle">{index + 1}</div>
              <p>{step}</p>
              {index < 3 && <ArrowRight className="step-arrow" />}
            </div>
          ))}
        </div>
      </section>

      {/* Impact Section */}
      <section className="impact-section">
        <h2>Making Real Impact Across Africa</h2>
        <div className="impact-cards">
          <div className="impact-card">
            <User className="impact-icon" />
            <h3>10,000+</h3>
            <p>Citizens Engaged</p>
          </div>
          <div className="impact-card">
            <FileText className="impact-icon" />
            <h3>5,000+</h3>
            <p>Reports Submitted</p>
          </div>
          <div className="impact-card">
            <CheckCircle className="impact-icon" />
            <h3>25,000+</h3>
            <p>Issues Resolved</p>
          </div>
          <div className="impact-card">
            <AlertCircle className="impact-icon" />
            <h3>2,000+</h3>
            <p>Corruption Cases Reported</p>
          </div>
        </div>
      </section>

      {/* Call-to-action Section */}
      <section className="cta-section">
        <h2>Ready to Make a Difference?</h2>
        <div className="cta-card">
          <p>
            Join thousands of citizens holding authorities accountable and making Africa transparent.
          </p>
          <button className="btn-primary" onClick={() => navigate("/login")}>Join Now</button>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
