import React from "react";
import { useNavigate } from "react-router-dom";
import "../components/ui/styles/components.css";
import { ThemeToggle } from "@/components/ThemeToggle";

// Import icons from lucide-react
import { Shield, Activity, Users, Flag, FileText, CheckCircle, MapPin, TrendingUp } from "lucide-react";

const Homepage: React.FC = () => {
  const navigate = useNavigate();

  const handleSignup = () => {
    // Navigate to auth page with signup mode
    navigate("/login", { state: { mode: 'signup' } });
  };

  return (
    <div className="homepage">
      {/* Navigation Header */}
      <header className="homepage-header">
        <div className="header-container">
          <div className="header-logo" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Flag size={24} style={{ color: 'hsl(var(--destructive))' }} />
            <h1 style={{ margin: 0 }}>iReporter</h1>
          </div>
          <nav className="header-nav">
            <a href="#features" className="nav-link">Features</a>
            <a href="#how-it-works" className="nav-link">How It Works</a>
            <a href="#impact" className="nav-link">Impact</a>
          </nav>
          <div className="header-actions">
            <ThemeToggle />
            <button className="btn-ghost" onClick={() => navigate("/login", { state: { mode: 'login' } })}>Login</button>
            <button className="btn-primary" onClick={handleSignup}>Get Started</button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">
            <Shield size={16} />
            Trusted by 10,000+ Citizens
          </div>
          <h1 className="hero-title">Empower Your Voice, Drive Change in Your Community</h1>
          <p className="hero-description">
            Report corruption and any other issues that would require government intervention directly to  the authorities. Join thousands of citizens making Africa more transparent and accountable.
          </p>
          <div className="hero-buttons">
            <button className="btn-primary btn-lg" onClick={handleSignup}>
              Report an Issue
            </button>
            <button className="btn-secondary btn-lg" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
              Learn More
            </button>
          </div>
          <div className="hero-features">
            <div className="feature-badge">
              <CheckCircle className="feature-icon" size={20} />
              Secure & Anonymous
            </div>
            <div className="feature-badge">
              <Activity className="feature-icon" size={20} />
              Real-time Tracking
            </div>
            <div className="feature-badge">
              <Users className="feature-icon" size={20} />
              Community Driven
            </div>
          </div>
        </div>
      </section>

      {/* Impact Statistics Section */}
      <section id="impact" className="stats-section">
        <h2 className="section-title">Making Real Impact Across Africa</h2>
        <p className="section-subtitle">Together, we're building more transparent and accountable communities</p>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)' }}>
              <Users size={28} />
            </div>
            <h3 className="stat-number">10,000+</h3>
            <p className="stat-label">Active Citizens</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)' }}>
              <TrendingUp size={28} />
            </div>
            <h3 className="stat-number">5,000+</h3>
            <p className="stat-label">Reports Submitted</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
              <CheckCircle size={28} />
            </div>
            <h3 className="stat-number">2,500+</h3>
            <p className="stat-label">Issues Resolved</p>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="how-it-works" className="process-section">
        <h2 className="section-title">Simple, Transparent Process</h2>
        <p className="section-subtitle">From report to resolution in four easy steps</p>
        <div className="process-steps">
          <div className="process-step">
            <div className="step-number">1</div>
            <h3 className="step-title">Create Account</h3>
            <p className="step-description">Sign up with your email and create a secure account</p>
          </div>
          <div className="process-step">
            <div className="step-number">2</div>
            <h3 className="step-title">Submit Report</h3>
            <p className="step-description">Describe the issue, add location, and upload evidence</p>
          </div>
          <div className="process-step">
            <div className="step-number">3</div>
            <h3 className="step-title">Track Progress</h3>
            <p className="step-description">Monitor your report status from draft to resolution</p>
          </div>
          <div className="process-step">
            <div className="step-number">4</div>
            <h3 className="step-title">See Change</h3>
            <p className="step-description">Get notified when authorities take action</p>
          </div>
        </div>
      </section>

      

      {/* Report Types Section */}
      <section id="features" className="report-types-section">
        <h2 className="section-title">Two Ways to Make a Difference</h2>
        <p className="section-subtitle">Whether it's corruption or broken infrastructure, your voice matters</p>
        <div className="report-types-grid">
          <div className="report-type-card">
            <div className="report-type-icon red-flag-icon">
              <Flag size={32} />
            </div>
            <h3 className="report-type-title">Red-Flag Reports</h3>
            <p className="report-type-description">
              Report incidents of corruption, bribery, embezzlement, and other forms of misconduct by public officials. 
              Your reports help authorities take action against corruption and misuse of government offices.
            </p>
            <ul className="report-type-features">
              <li><CheckCircle size={18} /> Anonymous reporting option</li>
              <li><CheckCircle size={18} /> Upload evidence (photos, videos)</li>
              <li><CheckCircle size={18} /> Track investigation status</li>
            </ul>
          </div>
          <div className="report-type-card intervention-card">
            <div className="report-type-icon intervention-icon">
              <MapPin size={32} />
            </div>
            <h3 className="report-type-title">Intervention Requests</h3>
            <p className="report-type-description">
              Report infrastructure problems like broken roads and bridges, non-functional streetlights, drug understocked hospitals, or damaged public facilities. 
              Help authorities prioritize repairs and maintenance.
            </p>
            <ul className="report-type-features">
              <li><CheckCircle size={18} /> Precise location mapping</li>
              <li><CheckCircle size={18} /> Visual documentation</li>
              <li><CheckCircle size={18} /> Resolution updates</li>
            </ul>
          </div>
        </div>
      </section>
{/* CTA Mid Section */}
      <section className="cta-mid-section">
        <div className="cta-mid-content">
          <h2 className="cta-mid-title">Ready to Make a Difference?</h2>
          <p className="cta-mid-description">
            Join thousands of citizens holding authorities accountable and improving government services. Your voice matters!
          </p>
           <div className="cta-final-buttons">
            <button className="btn-primary btn-lg" onClick={handleSignup}>
              Create an Account
            </button>
            <button className="btn-secondary btn-lg" onClick={() => navigate("/login", { state: { mode: 'login' } })}>
              Login
            </button>
          </div>
        </div>
      </section>
      
    </div>
  );
};

export default Homepage;
