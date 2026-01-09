import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../components/ui/styles/components.css";
import { ThemeToggle } from "@/components/ThemeToggle";
import LanguageSelector from "@/components/LanguageSelector";
import ClickableText from "@/components/ClickableText";
import {
  Shield,
  Activity,
  Users,
  Flag,
  FileText,
  CheckCircle,
  MapPin,
  TrendingUp,
  Star,
  Quote,
  Award,
  Globe,
  Heart,
  Zap,
  Eye,
  Target,
  Smartphone,
  Apple,
  Play,
  ExternalLink,
} from "lucide-react";

const Homepage: React.FC = () => {
 const navigate = useNavigate();
 const { t } = useTranslation();
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
              <ClickableText translationKey="nav.features" />
            </a>
            <a href="#how-it-works" className="nav-link">
              <ClickableText translationKey="nav.howItWorks" />
            </a>
            <a href="#impact" className="nav-link">
              <ClickableText translationKey="nav.impact" />
            </a>
          </nav>
          <div className="header-actions">
            <ThemeToggle />
            <LanguageSelector />
            <button
              className="btn-ghost"
              onClick={() => navigate("/login", { state: { mode: "login" } })}
            >
              <ClickableText translationKey="login" />
            </button>
            <button className="btn-primary" onClick={handleSignup}>
              <ClickableText translationKey="getStarted" />
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
            <ClickableText translationKey="hero.badge" />
          </div>
          <h1 className="hero-title">
            <ClickableText translationKey="hero.title" />
          </h1>
          <p className="hero-description">
            <ClickableText translationKey="hero.description" />
          </p>
          <div className="hero-buttons">
            <button className="btn-primary btn-lg" onClick={handleSignup}>
              <ClickableText translationKey="createAccountBtn" />
            </button>
            <button
              className="btn-secondary btn-lg"
              onClick={() =>
                document
                  .getElementById("features")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <ClickableText translationKey="learnMore" />
            </button>
          </div>
          <div className="hero-features">
            <div className="feature-badge">
              <CheckCircle className="feature-icon" size={20} />
              <ClickableText translationKey="secureAnonymous" />
            </div>
            <div className="feature-badge">
              <Activity className="feature-icon" size={20} />
              <ClickableText translationKey="realTimeTracking" />
            </div>
            <div className="feature-badge">
              <Users className="feature-icon" size={20} />
              <ClickableText translationKey="communityDriven" />
            </div>
          </div>
        </div>
      </section>

      
      <section id="impact" className="stats-section">
        <h2 className="section-title"><ClickableText translationKey="trustedBy" /></h2>
        <p className="section-subtitle">
          <ClickableText translationKey="stats.subtitle" />
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
            <p className="stat-label"><ClickableText translationKey="activeCitizens" /></p>
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
            <p className="stat-label"><ClickableText translationKey="reportsSubmitted" /></p>
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
            <p className="stat-label"><ClickableText translationKey="issuesResolved" /></p>
          </div>
        </div>
      </section>

      
      <section id="how-it-works" className="process-section">
        <h2 className="section-title"><ClickableText translationKey="simpleProcess" /></h2>
        <p className="section-subtitle">
          <ClickableText translationKey="process.subtitle" />
        </p>
        <div className="process-steps">
          <div className="process-step">
            <div className="step-number">1</div>
            <h3 className="step-title"><ClickableText translationKey="createAccount" /></h3>
            <p className="step-description">
              <ClickableText translationKey="process.step1.detail" />
            </p>
          </div>
          <div className="process-step">
            <div className="step-number">2</div>
            <h3 className="step-title"><ClickableText translationKey="submitReport" /></h3>
            <p className="step-description">
              <ClickableText translationKey="process.step2.detail" />
            </p>
          </div>
          <div className="process-step">
            <div className="step-number">3</div>
            <h3 className="step-title"><ClickableText translationKey="trackProgress" /></h3>
            <p className="step-description">
              <ClickableText translationKey="process.step3.detail" />
            </p>
          </div>
          <div className="process-step">
            <div className="step-number">4</div>
            <h3 className="step-title"><ClickableText translationKey="seeChange" /></h3>
            <p className="step-description">
              <ClickableText translationKey="process.step4.detail" />
            </p>
          </div>
        </div>
      </section>

      
      <section id="features" className="report-types-section">
        <h2 className="section-title"><ClickableText translationKey="twoWays" /></h2>
        <p className="section-subtitle">
          <ClickableText translationKey="reportTypes.subtitle" />
        </p>
        <div className="report-types-grid">
          <div className="report-type-card">
            <div className="report-type-icon red-flag-icon">
              <Flag size={32} />
            </div>
            <h3 className="report-type-title"><ClickableText translationKey="redFlagReports" /></h3>
            <p className="report-type-description">
              <ClickableText translationKey="redFlagDesc" />
            </p>
            <ul className="report-type-features">
              <li>
                <CheckCircle size={18} /> <ClickableText translationKey="anonymousReporting" />
              </li>
              <li>
                <CheckCircle size={18} /> <ClickableText translationKey="uploadEvidence" />
              </li>
              <li>
                <CheckCircle size={18} /> <ClickableText translationKey="trackStatus" />
              </li>
            </ul>
          </div>
          <div className="report-type-card intervention-card">
            <div className="report-type-icon intervention-icon">
              <MapPin size={32} />
            </div>
            <h3 className="report-type-title"><ClickableText translationKey="interventionRequests" /></h3>
            <p className="report-type-description">
              <ClickableText translationKey="interventionDesc" />
            </p>
            <ul className="report-type-features">
              <li>
                <CheckCircle size={18} /> <ClickableText translationKey="preciseMapping" />
              </li>
              <li>
                <CheckCircle size={18} /> <ClickableText translationKey="visualDoc" />
              </li>
              <li>
                <CheckCircle size={18} /> <ClickableText translationKey="resolutionUpdates" />
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="success-stories-section">
        <div className="success-stories-content">
          <h2 className="success-stories-title"><ClickableText translationKey="recentSuccess" /></h2>
          <p className="success-stories-subtitle">
            <ClickableText translationKey="seeChangeCommunity" />
          </p>
          <div className="success-stories-grid">
            <div className="success-story-card">
              <div className="success-story-status"><ClickableText translationKey="resolved" /></div>
              <div className="success-story-header">
                <div className="success-story-icon">
                  <Flag size={24} />
                </div>
                <div>
                  <div className="success-story-category"><ClickableText translationKey="redFlagReport" /></div>
                  <div className="success-story-location"><ClickableText translationKey="story1.location" /></div>
                </div>
              </div>
              <h3 className="success-story-title"><ClickableText translationKey="story1.title" /></h3>
              <p className="success-story-description">
                <ClickableText translationKey="story1.desc" />
              </p>
              <div className="success-story-stats">
                <div className="success-story-stat">
                  <div className="success-story-stat-number">₦2.5M</div>
                  <div className="success-story-stat-label"><ClickableText translationKey="fundsRecovered" /></div>
                </div>
                <div className="success-story-stat">
                  <div className="success-story-stat-number">3</div>
                  <div className="success-story-stat-label"><ClickableText translationKey="officialsCharged" /></div>
                </div>
                <div className="success-story-stat">
                  <div className="success-story-stat-number">45</div>
                  <div className="success-story-stat-label"><ClickableText translationKey="daysToResolution" /></div>
                </div>
              </div>
            </div>

            <div className="success-story-card">
              <div className="success-story-status"><ClickableText translationKey="resolved" /></div>
              <div className="success-story-header">
                <div className="success-story-icon">
                  <MapPin size={24} />
                </div>
                <div>
                  <div className="success-story-category"><ClickableText translationKey="interventionRequest" /></div>
                  <div className="success-story-location"><ClickableText translationKey="story2.location" /></div>
                </div>
              </div>
              <h3 className="success-story-title"><ClickableText translationKey="story2.title" /></h3>
              <p className="success-story-description">
                <ClickableText translationKey="story2.desc" />
              </p>
              <div className="success-story-stats">
                <div className="success-story-stat">
                  <div className="success-story-stat-number">15</div>
                  <div className="success-story-stat-label"><ClickableText translationKey="lightsRepaired" /></div>
                </div>
                <div className="success-story-stat">
                  <div className="success-story-stat-number">48hrs</div>
                  <div className="success-story-stat-label"><ClickableText translationKey="responseTime" /></div>
                </div>
                <div className="success-story-stat">
                  <div className="success-story-stat-number">200+</div>
                  <div className="success-story-stat-label"><ClickableText translationKey="citizensBenefited" /></div>
                </div>
              </div>
            </div>

            <div className="success-story-card">
              <div className="success-story-status"><ClickableText translationKey="resolved" /></div>
              <div className="success-story-header">
                <div className="success-story-icon">
                  <Heart size={24} />
                </div>
                <div>
                  <div className="success-story-category"><ClickableText translationKey="healthcareIssue" /></div>
                  <div className="success-story-location"><ClickableText translationKey="story3.location" /></div>
                </div>
              </div>
              <h3 className="success-story-title"><ClickableText translationKey="story3.title" /></h3>
              <p className="success-story-description">
                <ClickableText translationKey="story3.desc" />
              </p>
              <div className="success-story-stats">
                <div className="success-story-stat">
                  <div className="success-story-stat-number">8</div>
                  <div className="success-story-stat-label"><ClickableText translationKey="equipmentFixed" /></div>
                </div>
                <div className="success-story-stat">
                  <div className="success-story-stat-number">24hrs</div>
                  <div className="success-story-stat-label"><ClickableText translationKey="responseTime" /></div>
                </div>
                <div className="success-story-stat">
                  <div className="success-story-stat-number">500+</div>
                  <div className="success-story-stat-label"><ClickableText translationKey="patientsHelped" /></div>
                </div>
              </div>
            </div>
          </div>
          <a href="/reports" className="view-all-stories">
            <ClickableText translationKey="viewAllStories" />
          </a>
        </div>
      </section>

      <section className="partners-section">
        <h2 className="section-title"><ClickableText translationKey="trustedPartners" /></h2>
        <p className="section-subtitle"><ClickableText translationKey="workingTogether" /></p>
        <div className="partners-grid">
          <div className="partner-logo">
            <div className="partner-placeholder">
              <Shield size={32} style={{ marginBottom: '0.5rem', color: 'hsl(var(--primary))' }} />
              <ClickableText translationKey="partner1" />
            </div>
          </div>
          <div className="partner-logo">
            <div className="partner-placeholder">
              <Heart size={32} style={{ marginBottom: '0.5rem', color: 'hsl(var(--primary))' }} />
              <ClickableText translationKey="partner2" />
            </div>
          </div>
          <div className="partner-logo">
            <div className="partner-placeholder">
              <Globe size={32} style={{ marginBottom: '0.5rem', color: 'hsl(var(--primary))' }} />
              <ClickableText translationKey="partner3" />
            </div>
          </div>
          <div className="partner-logo">
            <div className="partner-placeholder">
              <Award size={32} style={{ marginBottom: '0.5rem', color: 'hsl(var(--primary))' }} />
              <ClickableText translationKey="partner4" />
            </div>
          </div>
          <div className="partner-logo">
            <div className="partner-placeholder">
              <Eye size={32} style={{ marginBottom: '0.5rem', color: 'hsl(var(--primary))' }} />
              <ClickableText translationKey="partner5" />
            </div>
          </div>
          <div className="partner-logo">
            <div className="partner-placeholder">
              <Target size={32} style={{ marginBottom: '0.5rem', color: 'hsl(var(--primary))' }} />
              <ClickableText translationKey="partner6" />
            </div>
          </div>
        </div>
      </section>

      <section className="mobile-app-section">
        <div className="mobile-app-content">
          <h2 className="mobile-app-title"><ClickableText translationKey="getApp" /></h2>
          <p className="mobile-app-description">
            <ClickableText translationKey="appDesc" />
          </p>
          <div className="app-stores">
            <a
              href="https://apps.apple.com/app/ireporter/id1234567890"
              className="app-store-btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Apple className="app-store-icon" />
              <div className="app-store-text">
                <span className="app-store-label"><ClickableText translationKey="downloadOnThe" /></span>
                <span className="app-store-name"><ClickableText translationKey="appStore" /></span>
              </div>
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=com.ireporter.app"
              className="app-store-btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Play className="app-store-icon" />
              <div className="app-store-text">
                <span className="app-store-label"><ClickableText translationKey="getItOn" /></span>
                <span className="app-store-name"><ClickableText translationKey="googlePlay" /></span>
              </div>
            </a>
          </div>
        </div>
      </section>

      <section className="cta-mid-section">
        <div className="cta-mid-content">
          <h2 className="cta-mid-title"><ClickableText translationKey="readyToMakeDifference" /></h2>
          <p className="cta-mid-description">
            <ClickableText translationKey="joinThousands" />
          </p>
          <div className="cta-final-buttons">
            <button className="btn-primary btn-lg" onClick={handleSignup}>
              <ClickableText translationKey="createAccountBtn" />
            </button>
            <button
              className="btn-secondary btn-lg"
              onClick={() => navigate("/login", { state: { mode: "login" } })}
            >
              <ClickableText translationKey="loginBtn" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
