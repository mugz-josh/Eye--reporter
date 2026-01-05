import React from "react";
import { useNavigate } from "react-router-dom";
import "../components/ui/styles/components.css";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Shield,
  Activity,
  Users,
  Flag,
  FileText,
  CheckCircle,
  MapPin,
  TrendingUp,
} from "lucide-react";

const Homepage: React.FC = () => {
 const navigate = useNavigate();
const handleSignup = () => {
 navigate("/login", { state: { mode: "signup" } });
  };

  return (
    <div className="homepage">
      <header className="homepage-header">
        <div className="header-container">
          <div
            className="header-logo"
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <Flag size={24} style={{ color: "hsl(var(--destructive))" }} />
            <h1 style={{ margin: 0 }}>iReporter</h1>
          </div>
          <nav className="header-nav">
            <a href="#features" className="nav-link">
              Features
            </a>
            <a href="#how-it-works" className="nav-link">
              How It Works
            </a>
            <a href="#impact" className="nav-link">
              Impact
            </a>
          </nav>
          <div className="header-actions">
            <ThemeToggle />
            <button
              className="btn-ghost"
              onClick={() => navigate("/login", { state: { mode: "login" } })}
            >
              Login
            </button>
            <button className="btn-primary" onClick={handleSignup}>
              Get Started
            </button>
          </div>
        </div>
      </header>

      
      <section
        className="hero"
        style={{
          backgroundImage:
            "url(https://stories.freepiklabs.com/api/vectors/people-watching-the-news/amico/render?color=263238FF&background=complete&hide=)",
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-badge">
            <Shield size={16} />
            Trusted by 10,000+ Citizens
          </div>
          <h1 className="hero-title">
            Empower Your Voice, Drive Change in Your Community
          </h1>
          <p className="hero-description">
            Report corruption and any other issues that would require government
            intervention directly to the authorities. Join thousands of citizens
            making Africa more transparent and accountable.
          </p>
          <div className="hero-buttons">
            <button className="btn-primary btn-lg" onClick={handleSignup}>
              Report an Issue
            </button>
            <button
              className="btn-secondary btn-lg"
              onClick={() =>
                document
                  .getElementById("features")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
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

      
      <section id="impact" className="stats-section">
        <h2 className="section-title">Making Real Impact Across Africa</h2>
        <p className="section-subtitle">
          Together, we're building more transparent and accountable communities
        </p>
        <div className="stats-grid">
          <div className="stat-card">
            <div
              className="stat-icon"
              style={{
                background: "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)",
              }}
            >
              <Users size={28} />
            </div>
            <h3 className="stat-number">10,000+</h3>
            <p className="stat-label">Active Citizens</p>
          </div>
          <div className="stat-card">
            <div
              className="stat-icon"
              style={{
                background: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
              }}
            >
              <TrendingUp size={28} />
            </div>
            <h3 className="stat-number">5,000+</h3>
            <p className="stat-label">Reports Submitted</p>
          </div>
          <div className="stat-card">
            <div
              className="stat-icon"
              style={{
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              }}
            >
              <CheckCircle size={28} />
            </div>
            <h3 className="stat-number">2,500+</h3>
            <p className="stat-label">Issues Resolved</p>
          </div>
        </div>
      </section>

      
      <section id="how-it-works" className="process-section">
        <h2 className="section-title">Simple, Transparent Process</h2>
        <p className="section-subtitle">
          From report to resolution in four easy steps
        </p>
        <div className="process-steps">
          <div className="process-step">
            <div className="step-number">1</div>
            <h3 className="step-title">Create Account</h3>
            <p className="step-description">
              Sign up with your email and create a secure account
            </p>
          </div>
          <div className="process-step">
            <div className="step-number">2</div>
            <h3 className="step-title">Submit Report</h3>
            <p className="step-description">
              Describe the issue, add location, and upload evidence
            </p>
          </div>
          <div className="process-step">
            <div className="step-number">3</div>
            <h3 className="step-title">Track Progress</h3>
            <p className="step-description">
              Monitor your report status from draft to resolution
            </p>
          </div>
          <div className="process-step">
            <div className="step-number">4</div>
            <h3 className="step-title">See Change</h3>
            <p className="step-description">
              Get notified when authorities take action
            </p>
          </div>
        </div>
      </section>

      
      <section id="features" className="report-types-section">
        <h2 className="section-title">Two Ways to Make a Difference</h2>
        <p className="section-subtitle">
          Whether it's corruption or broken infrastructure, your voice matters
        </p>
        <div className="report-types-grid">
          <div className="report-type-card">
            <div className="report-type-icon red-flag-icon">
              <Flag size={32} />
            </div>
            <h3 className="report-type-title">Red-Flag Reports</h3>
            <p className="report-type-description">
              Report incidents of corruption, bribery, embezzlement, and other
              forms of misconduct by public officials. Your reports help
              authorities take action against corruption and misuse of
              government offices.
            </p>
            <ul className="report-type-features">
              <li>
                <CheckCircle size={18} /> Anonymous reporting option
              </li>
              <li>
                <CheckCircle size={18} /> Upload evidence (photos, videos)
              </li>
              <li>
                <CheckCircle size={18} /> Track investigation status
              </li>
            </ul>
          </div>
          <div className="report-type-card intervention-card">
            <div className="report-type-icon intervention-icon">
              <MapPin size={32} />
            </div>
            <h3 className="report-type-title">Intervention Requests</h3>
            <p className="report-type-description">
              Report infrastructure problems like broken roads and bridges,
              non-functional streetlights, drug understocked hospitals, or
              damaged public facilities. Help authorities prioritize repairs and
              maintenance.
            </p>
            <ul className="report-type-features">
              <li>
                <CheckCircle size={18} /> Precise location mapping
              </li>
              <li>
                <CheckCircle size={18} /> Visual documentation
              </li>
              <li>
                <CheckCircle size={18} /> Resolution updates
              </li>
            </ul>
          </div>
        </div>
      </section>
    
      {/* Testimonials Section */}
      <section className="testimonials-section">
        <h2 className="section-title">What Citizens Are Saying</h2>
        <p className="section-subtitle">
          Real stories from real people making real change
        </p>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="testimonial-content">
              <p className="testimonial-text">
                "iReporter helped me report a corrupt official in my community. Within weeks, action was taken and justice was served. This platform truly empowers citizens!"
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <span>SA</span>
                </div>
                <div className="author-info">
                  <h4>Sarah Adebayo</h4>
                  <p>Lagos, Nigeria</p>
                </div>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-content">
              <p className="testimonial-text">
                "The potholes on our main road were dangerous for months. Thanks to iReporter, the local government fixed them within two weeks. Amazing platform!"
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <span>MK</span>
                </div>
                <div className="author-info">
                  <h4>Michael Kofi</h4>
                  <p>Accra, Ghana</p>
                </div>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-content">
              <p className="testimonial-text">
                "As a journalist, I use iReporter to track corruption stories. The real-time updates and community features make it invaluable for investigative work."
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <span>ZN</span>
                </div>
                <div className="author-info">
                  <h4>Zara Ndlovu</h4>
                  <p>Harare, Zimbabwe</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <h2 className="section-title">Frequently Asked Questions</h2>
        <p className="section-subtitle">
          Everything you need to know about reporting issues
        </p>
        <div className="faq-grid">
          <div className="faq-item">
            <h3 className="faq-question">Is my report anonymous?</h3>
            <p className="faq-answer">
              Yes, you can choose to submit reports anonymously. Your personal information will not be shared with authorities unless you explicitly consent.
            </p>
          </div>

          <div className="faq-item">
            <h3 className="faq-question">How long does it take for action to be taken?</h3>
            <p className="faq-answer">
              Response times vary depending on the severity and type of issue. Most reports receive initial acknowledgment within 48 hours, with resolution updates provided regularly.
            </p>
          </div>

          <div className="faq-item">
            <h3 className="faq-question">Can I track the status of my report?</h3>
            <p className="faq-answer">
              Absolutely! You'll receive real-time notifications and can track your report's progress from submission to resolution through your dashboard.
            </p>
          </div>

          <div className="faq-item">
            <h3 className="faq-question">What types of issues can I report?</h3>
            <p className="faq-answer">
              You can report corruption incidents (red-flag reports) or request government intervention for infrastructure issues like broken roads, faulty streetlights, or damaged public facilities.
            </p>
          </div>
        </div>
      </section>

      {/* Professional Footer */}
      <footer className="professional-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="footer-logo">
              <Flag size={24} style={{ color: "hsl(var(--destructive))" }} />
              <h3>iReporter</h3>
            </div>
            <p>Empowering citizens to drive positive change in their communities through transparent reporting and accountability.</p>
            <div className="footer-social">
              <a href="#" className="social-link">Twitter</a>
              <a href="#" className="social-link">Facebook</a>
              <a href="#" className="social-link">LinkedIn</a>
            </div>
          </div>

          <div className="footer-links">
            <div className="footer-column">
              <h4>Platform</h4>
              <a href="#features">Features</a>
              <a href="#how-it-works">How It Works</a>
              <a href="#impact">Impact</a>
              <a href="/support">Support</a>
            </div>

            <div className="footer-column">
              <h4>Legal</h4>
              <a href="/privacy">Privacy Policy</a>
              <a href="/terms">Terms of Service</a>
              <a href="/cookies">Cookie Policy</a>
            </div>

            <div className="footer-column">
              <h4>Contact</h4>
              <a href="mailto:support@ireporter.com">support@ireporter.com</a>
              <a href="/support">Help Center</a>
              <a href="/feedback">Send Feedback</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2024 iReporter. All rights reserved. Made with ❤️ for transparent governance.</p>
        </div>
      </footer>

      <section className="cta-mid-section">
        <div className="cta-mid-content">
          <h2 className="cta-mid-title">Ready to Make a Difference?</h2>
          <p className="cta-mid-description">
            Join thousands of citizens holding authorities accountable and
            improving government services. Your voice really matters!
          </p>
          <div className="cta-final-buttons">
            <button className="btn-primary btn-lg" onClick={handleSignup}>
              Create an Account
            </button>
            <button
              className="btn-secondary btn-lg"
              onClick={() => navigate("/login", { state: { mode: "login" } })}
            >
              Login
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
