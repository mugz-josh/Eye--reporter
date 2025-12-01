import transporter from '../utils/email';

class EmailService {
  static async sendReportStatusNotification(
    userEmail: string | string[],
    reportType: string,
    reportTitle: string,
    oldStatus: string,
    newStatus: string
  ): Promise<void> {
    try {
      const userEmailString = Array.isArray(userEmail)
        ? userEmail.join(', ')
        : userEmail;

      const adminEmail =
        process.env.ADMIN_EMAIL || 'joshua.mugisha.upti@gmail.com';

      const reportTypeDisplay =
        reportType === 'redflag' ? 'Red Flag' : 'Intervention';

      const userMailOptions = {
        from: `iReporter System <${process.env.EMAIL_USER}>`,
        to: userEmailString,
        subject: `Update: Your ${reportTypeDisplay} Report Status`,
        html: this.createUserEmailTemplate(
          userEmailString,
          reportTypeDisplay,
          reportTitle,
          oldStatus,
          newStatus
        )
      };

      const adminMailOptions = {
        from: `iReporter System <${process.env.EMAIL_USER}>`,
        to: adminEmail,
        subject: `[Admin Notice] ${reportTypeDisplay} Report Status Updated`,
        html: this.createAdminEmailTemplate(
          userEmailString,
          reportTypeDisplay,
          reportTitle,
          oldStatus,
          newStatus
        )
      };

      await Promise.all([
        transporter.sendMail(userMailOptions),
        transporter.sendMail(adminMailOptions)
      ]);

      console.log('Emails sent successfully.');
    } catch (error) {
      console.error('Email sending error:', error);
      throw error;
    }
  }

  // ================================================================
  // STYLE CONFIGURATION - MODERN DESIGN
  // ================================================================
  private static getStyles(): {
    colors: Record<string, string>;
    fonts: Record<string, string>;
    spacing: Record<string, string>;
    breakpoints: Record<string, string>;
    shadows: Record<string, string>;
  } {
    return {
      colors: {
        primary: "#2c3e50",
        secondary: "#3498db",
        accent: "#1abc9c",
        success: "#27ae60",
        warning: "#f39c12",
        danger: "#e74c3c",
        light: "#f8f9fa",
        dark: "#2c3e50",
        gray: "#95a5a6",
        lightGray: "#ecf0f1",
        white: "#ffffff",
        background: "#f5f7fa"
      },
      fonts: {
        primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        mono: "'SF Mono', 'Roboto Mono', Consolas, monospace"
      },
      spacing: {
        xs: "8px",
        sm: "12px",
        md: "16px",
        lg: "24px",
        xl: "32px",
        xxl: "48px"
      },
      breakpoints: {
        mobile: "600px",
        tablet: "768px"
      },
      shadows: {
        sm: "0 2px 4px rgba(0,0,0,0.05)",
        md: "0 4px 12px rgba(0,0,0,0.08)",
        lg: "0 8px 24px rgba(0,0,0,0.12)"
      }
    };
  }

  // ================================================================
  // SHARED STYLE TEMPLATES - MODERN
  // ================================================================
  private static getBaseStyles(): string {
    const style = this.getStyles();
    return `
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: ${style.fonts.primary};
        background-color: ${style.colors.background};
        color: ${style.colors.dark};
        line-height: 1.6;
        padding: ${style.spacing.lg};
      }
      
      .email-wrapper {
        max-width: 680px;
        margin: 0 auto;
        background: ${style.colors.white};
        border-radius: 16px;
        overflow: hidden;
        box-shadow: ${style.shadows.lg};
      }
      
      /* Header */
      .header {
        background: linear-gradient(135deg, ${style.colors.primary} 0%, #1a2530 100%);
        padding: ${style.spacing.xxl} ${style.spacing.xl};
        text-align: center;
        color: ${style.colors.white};
        position: relative;
      }
      
      .logo-badge {
        position: absolute;
        top: ${style.spacing.lg};
        left: ${style.spacing.lg};
        background: ${style.colors.accent};
        color: white;
        font-size: 11px;
        font-weight: 600;
        padding: 4px 12px;
        border-radius: 20px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      .logo-container {
        width: 96px;
        height: 96px;
        margin: 0 auto ${style.spacing.lg};
        background: ${style.colors.white};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        border: 4px solid rgba(255,255,255,0.2);
      }
      
      .logo {
        width: 64px;
        height: 64px;
        object-fit: contain;
      }
      
      .header-title {
        font-size: 28px;
        font-weight: 700;
        margin-bottom: ${style.spacing.sm};
        letter-spacing: -0.5px;
      }
      
      .header-subtitle {
        font-size: 14px;
        opacity: 0.9;
        font-weight: 400;
      }
      
      /* Content Area */
      .content {
        padding: ${style.spacing.xxl};
      }
      
      /* Modern Table */
      .data-table {
        width: 100%;
        border-collapse: separate;
        border-spacing: 0;
        margin: ${style.spacing.xl} 0;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: ${style.shadows.md};
      }
      
      .data-table thead {
        background: linear-gradient(135deg, ${style.colors.secondary} 0%, #2980b9 100%);
      }
      
      .data-table th {
        padding: ${style.spacing.lg} ${style.spacing.xl};
        text-align: left;
        color: ${style.colors.white};
        font-weight: 600;
        font-size: 14px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      .data-table tbody tr {
        border-bottom: 1px solid ${style.colors.lightGray};
        transition: background-color 0.2s ease;
      }
      
      .data-table tbody tr:nth-child(even) {
        background-color: ${style.colors.light};
      }
      
      .data-table tbody tr:hover {
        background-color: rgba(52, 152, 219, 0.05);
      }
      
      .data-table td {
        padding: ${style.spacing.lg} ${style.spacing.xl};
        font-size: 15px;
        vertical-align: middle;
      }
      
      .data-table .label {
        font-weight: 600;
        color: ${style.colors.primary};
        min-width: 140px;
      }
      
      /* Status Panel */
      .status-panel {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: ${style.spacing.lg};
        margin: ${style.spacing.xl} 0;
      }
      
      .status-card {
        padding: ${style.spacing.xl};
        border-radius: 12px;
        text-align: center;
        background: ${style.colors.white};
        border: 2px solid ${style.colors.lightGray};
        transition: all 0.3s ease;
      }
      
      .status-card:hover {
        transform: translateY(-4px);
        box-shadow: ${style.shadows.lg};
      }
      
      .status-card.old {
        border-color: ${style.colors.gray};
      }
      
      .status-card.new {
        border-color: ${style.colors.secondary};
        background: linear-gradient(135deg, #f8fafc 0%, #f1f8ff 100%);
      }
      
      .status-label {
        font-size: 13px;
        text-transform: uppercase;
        letter-spacing: 1px;
        color: ${style.colors.gray};
        margin-bottom: ${style.spacing.md};
        font-weight: 600;
      }
      
      .status-value {
        font-size: 22px;
        font-weight: 700;
        padding: ${style.spacing.sm} ${style.spacing.lg};
        border-radius: 8px;
        display: inline-block;
      }
      
      .old-value {
        background: ${style.colors.lightGray};
        color: ${style.colors.dark};
      }
      
      .new-value {
        background: linear-gradient(135deg, ${style.colors.secondary} 0%, #2980b9 100%);
        color: ${style.colors.white};
        box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
      }
      
      /* Priority Badge */
      .priority-badge {
        display: inline-flex;
        align-items: center;
        padding: 6px 16px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      .priority-high {
        background: linear-gradient(135deg, #ff6b6b 0%, #e74c3c 100%);
        color: white;
      }
      
      .priority-medium {
        background: linear-gradient(135deg, #feca57 0%, #f39c12 100%);
        color: #2d3436;
      }
      
      .priority-low {
        background: linear-gradient(135deg, #1dd1a1 0%, #10ac84 100%);
        color: white;
      }
      
      /* Action Cards */
      .action-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: ${style.spacing.lg};
        margin: ${style.spacing.xl} 0;
      }
      
      .action-card {
        padding: ${style.spacing.xl};
        border-radius: 12px;
        background: ${style.colors.white};
        border: 2px solid ${style.colors.lightGray};
        text-align: center;
        transition: all 0.3s ease;
      }
      
      .action-card:hover {
        transform: translateY(-4px);
        border-color: ${style.colors.secondary};
        box-shadow: ${style.shadows.lg};
      }
      
      .action-icon {
        font-size: 32px;
        margin-bottom: ${style.spacing.md};
      }
      
      .action-title {
        font-size: 16px;
        font-weight: 600;
        margin-bottom: ${style.spacing.sm};
        color: ${style.colors.primary};
      }
      
      .action-description {
        font-size: 13px;
        color: ${style.colors.gray};
        margin-bottom: ${style.spacing.md};
      }
      
      /* Buttons */
      .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: ${style.spacing.md} ${style.spacing.xl};
        border-radius: 10px;
        text-decoration: none;
        font-weight: 600;
        font-size: 15px;
        transition: all 0.3s ease;
        border: none;
        cursor: pointer;
        gap: ${style.spacing.sm};
        min-width: 160px;
      }
      
      .btn-primary {
        background: linear-gradient(135deg, ${style.colors.secondary} 0%, #2980b9 100%);
        color: ${style.colors.white};
      }
      
      .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(52, 152, 219, 0.4);
      }
      
      .btn-secondary {
        background: ${style.colors.light};
        color: ${style.colors.primary};
        border: 2px solid ${style.colors.lightGray};
      }
      
      .btn-secondary:hover {
        border-color: ${style.colors.secondary};
        background: ${style.colors.white};
      }
      
      /* Footer */
      .footer {
        background: linear-gradient(135deg, #2c3e50 0%, #1a2530 100%);
        padding: ${style.spacing.xxl} ${style.spacing.xl};
        color: ${style.colors.white};
        text-align: center;
      }
      
      .footer-links {
        display: flex;
        justify-content: center;
        gap: ${style.spacing.xl};
        margin: ${style.spacing.xl} 0;
        flex-wrap: wrap;
      }
      
      .footer-link {
        color: rgba(255,255,255,0.8);
        text-decoration: none;
        font-size: 13px;
        transition: color 0.3s ease;
      }
      
      .footer-link:hover {
        color: ${style.colors.accent};
      }
      
      .footer-copyright {
        font-size: 12px;
        color: rgba(255,255,255,0.6);
        margin-top: ${style.spacing.xl};
        line-height: 1.5;
      }
      
      /* Alert Box */
      .alert {
        padding: ${style.spacing.xl};
        border-radius: 12px;
        margin: ${style.spacing.xl} 0;
        border-left: 4px solid;
        background: ${style.colors.light};
      }
      
      .alert-warning {
        border-color: ${style.colors.warning};
        background: linear-gradient(135deg, rgba(243, 156, 18, 0.05) 0%, rgba(243, 156, 18, 0.1) 100%);
      }
      
      .alert-info {
        border-color: ${style.colors.secondary};
        background: linear-gradient(135deg, rgba(52, 152, 219, 0.05) 0%, rgba(52, 152, 219, 0.1) 100%);
      }
      
      /* Mobile Responsive */
      @media (max-width: ${style.breakpoints.tablet}) {
        .content {
          padding: ${style.spacing.xl};
        }
        
        .status-panel {
          grid-template-columns: 1fr;
        }
        
        .action-grid {
          grid-template-columns: 1fr;
        }
        
        .data-table {
          display: block;
          overflow-x: auto;
        }
      }
      
      @media (max-width: ${style.breakpoints.mobile}) {
        body {
          padding: ${style.spacing.sm};
        }
        
        .header, .content, .footer {
          padding: ${style.spacing.lg};
        }
        
        .header-title {
          font-size: 24px;
        }
        
        .data-table th,
        .data-table td {
          padding: ${style.spacing.md};
        }
        
        .footer-links {
          flex-direction: column;
          gap: ${style.spacing.md};
        }
        
        .btn {
          width: 100%;
        }
      }
      
      /* Utility Classes */
      .text-center { text-align: center; }
      .text-primary { color: ${style.colors.primary}; }
      .text-secondary { color: ${style.colors.secondary}; }
      .text-success { color: ${style.colors.success}; }
      .text-danger { color: ${style.colors.danger}; }
      .mb-1 { margin-bottom: ${style.spacing.sm}; }
      .mb-2 { margin-bottom: ${style.spacing.md}; }
      .mb-3 { margin-bottom: ${style.spacing.lg}; }
      .mb-4 { margin-bottom: ${style.spacing.xl}; }
      .mt-1 { margin-top: ${style.spacing.sm}; }
      .mt-2 { margin-top: ${style.spacing.md}; }
      .mt-3 { margin-top: ${style.spacing.lg}; }
      .mt-4 { margin-top: ${style.spacing.xl}; }
    `;
  }

  // ================================================================
  // USER EMAIL TEMPLATE - MODERN DESIGN
  // ================================================================
  private static createUserEmailTemplate(
    userEmail: string,
    reportType: string,
    reportTitle: string,
    oldStatus: string,
    newStatus: string
  ): string {
    const style = this.getStyles();
    const logoUrl = "https://cdn.vectorstock.com/i/1000v/80/63/reporter-mascot-logo-design-vector-45838063.jpg";
    const supportEmail = "support@ireporter.com";
    const helpCenterUrl = "https://ireporter.com/help";
    const privacyPolicyUrl = "https://ireporter.com/privacy";
    const termsUrl = "https://ireporter.com/terms";
    const reportUrl = "https://ireporter.com/reports";
    const dashboardUrl = "https://ireporter.com/dashboard";
    const contactUrl = "https://ireporter.com/contact";

    const getPriorityLevel = (status: string): string => {
      switch (status) {
        case "under-investigation": return "HIGH PRIORITY";
        case "rejected": return "MEDIUM PRIORITY";
        case "resolved": return "LOW PRIORITY";
        default: return "STANDARD";
      }
    };

    const getPriorityClass = (status: string): string => {
      switch (status) {
        case "under-investigation": return "priority-high";
        case "rejected": return "priority-medium";
        case "resolved": return "priority-low";
        default: return "priority-low";
      }
    };

    const getStatusEmoji = (status: string): string => {
      switch (status.toLowerCase()) {
        case "under-investigation": return "🔍";
        case "rejected": return "❌";
        case "resolved": return "✅";
        case "pending": return "⏳";
        default: return "📋";
      }
    };

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Report Status Update - iReporter</title>
  <style>${this.getBaseStyles()}</style>
</head>
<body>
  <div class="email-wrapper">
    <!-- Header -->
    <div class="header">
      <div class="logo-badge">Status Update</div>
      <div class="logo-container">
        <img src="${logoUrl}" alt="iReporter Logo" class="logo">
      </div>
      <h1 class="header-title">Report Status Updated</h1>
      <p class="header-subtitle">Your ${reportType} report has been reviewed</p>
    </div>
    
    <!-- Content -->
    <div class="content">
      <!-- Greeting -->
      <div class="mb-4">
        <h2 class="mb-2">Hello ${userEmail.split('@')[0]},</h2>
        <p>Your report has been reviewed and its status has been updated. Here are the details:</p>
      </div>
      
      <!-- Report Summary Table -->
      <table class="data-table">
        <thead>
          <tr>
            <th colspan="2">Report Summary</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="label">Report Type</td>
            <td>
              <strong>${reportType}</strong>
              <span class="priority-badge ${getPriorityClass(newStatus)}" style="margin-left: 12px;">
                ${getPriorityLevel(newStatus)}
              </span>
            </td>
          </tr>
          <tr>
            <td class="label">Report Title</td>
            <td>"${reportTitle}"</td>
          </tr>
          <tr>
            <td class="label">Report ID</td>
            <td><code>#${Math.random().toString(36).substr(2, 9).toUpperCase()}</code></td>
          </tr>
          <tr>
            <td class="label">Date Submitted</td>
            <td>${new Date().toLocaleDateString('en-US', { 
              weekday: 'long',
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</td>
          </tr>
          <tr>
            <td class="label">Last Updated</td>
            <td>${new Date().toLocaleDateString('en-US', { 
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</td>
          </tr>
        </tbody>
      </table>
      
      <!-- Status Update -->
      <h3 class="mb-2 text-primary">Status Update</h3>
      <div class="status-panel">
        <div class="status-card old">
          <div class="status-label">Previous Status</div>
          <div class="status-value old-value">
            ${getStatusEmoji(oldStatus)} ${oldStatus.toUpperCase()}
          </div>
        </div>
        
        <div class="status-card new">
          <div class="status-label">Current Status</div>
          <div class="status-value new-value">
            ${getStatusEmoji(newStatus)} ${newStatus.toUpperCase()}
          </div>
        </div>
      </div>
      
      <!-- Action Grid -->
      <h3 class="mb-2 text-primary">What You Can Do</h3>
      <div class="action-grid">
        <div class="action-card">
          <div class="action-icon">📋</div>
          <div class="action-title">View Details</div>
          <div class="action-description">See complete report details and updates</div>
          <a href="${reportUrl}" class="btn btn-primary">View Report</a>
        </div>
        
        <div class="action-card">
          <div class="action-icon">📊</div>
          <div class="action-title">Your Dashboard</div>
          <div class="action-description">Check all your reports in one place</div>
          <a href="${dashboardUrl}" class="btn btn-secondary">Go to Dashboard</a>
        </div>
        
        <div class="action-card">
          <div class="action-icon">📞</div>
          <div class="action-title">Get Support</div>
          <div class="action-description">Contact our support team for help</div>
          <a href="${contactUrl}" class="btn btn-secondary">Contact Support</a>
        </div>
      </div>
      
      <!-- Timeline Table -->
      <h3 class="mb-2 text-primary">Next Steps Timeline</h3>
      <table class="data-table">
        <thead>
          <tr>
            <th>Step</th>
            <th>Description</th>
            <th>Expected Time</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Review</strong></td>
            <td>Administrative review of the status change</td>
            <td>1-2 business days</td>
          </tr>
          <tr>
            <td><strong>Processing</strong></td>
            <td>System updates and notification processing</td>
            <td>Immediate</td>
          </tr>
          <tr>
            <td><strong>Follow-up</strong></td>
            <td>Additional review if required</td>
            <td>3-5 business days</td>
          </tr>
          <tr>
            <td><strong>Resolution</strong></td>
            <td>Final resolution and closure</td>
            <td>${newStatus === 'resolved' ? 'Completed' : 'Pending'}</td>
          </tr>
        </tbody>
      </table>
      
      <!-- Important Alert -->
      <div class="alert alert-warning">
        <strong>⚠️ Important Notice:</strong>
        <p class="mt-1">
          This is an automated notification. Please do not reply to this email. 
          For inquiries, contact <a href="mailto:${supportEmail}" style="color: ${style.colors.warning};">${supportEmail}</a>.
          Keep your Report ID for future reference.
        </p>
      </div>
    </div>
    
    <!-- Footer -->
    <div class="footer">
      <div class="footer-links">
        <a href="${helpCenterUrl}" class="footer-link">Help Center</a>
        <a href="${privacyPolicyUrl}" class="footer-link">Privacy Policy</a>
        <a href="${termsUrl}" class="footer-link">Terms of Service</a>
        <a href="${dashboardUrl}" class="footer-link">Your Dashboard</a>
        <a href="${reportUrl}" class="footer-link">Report Portal</a>
      </div>
      <div class="footer-copyright">
        <p>© ${new Date().getFullYear()} iReporter. All rights reserved.</p>
        <p>This email was sent to ${userEmail}</p>
        <p style="opacity: 0.7; font-size: 11px; margin-top: 8px;">
          Reference: #${Math.random().toString(36).substr(2, 9).toUpperCase()} • 
          Tracking: ${Date.now().toString(36).toUpperCase()}
        </p>
      </div>
    </div>
  </div>
</body>
</html>
    `;
  }

  // ================================================================
  // ADMIN EMAIL TEMPLATE - MODERN DASHBOARD STYLE
  // ================================================================
  private static createAdminEmailTemplate(
    userEmail: string,
    reportType: string,
    reportTitle: string,
    oldStatus: string,
    newStatus: string
  ): string {
    const style = this.getStyles();
    const logoUrl = "https://cdn.vectorstock.com/i/1000v/80/63/reporter-mascot-logo-design-vector-45838063.jpg";
    const adminPanelUrl = "https://ireporter.com/admin";
    const userProfileUrl = "https://ireporter.com/admin/users";
    const auditLogsUrl = "https://ireporter.com/admin/audit-logs";
    const reportDetailsUrl = "https://ireporter.com/admin/reports";
    const analyticsUrl = "https://ireporter.com/admin/analytics";
    const settingsUrl = "https://ireporter.com/admin/settings";

    const getPriorityLevel = (status: string): string => {
      switch (status) {
        case "under-investigation": return "HIGH PRIORITY";
        case "rejected": return "MEDIUM PRIORITY";
        case "resolved": return "LOW PRIORITY";
        default: return "STANDARD";
      }
    };

    const getPriorityClass = (status: string): string => {
      switch (status) {
        case "under-investigation": return "priority-high";
        case "rejected": return "priority-medium";
        case "resolved": return "priority-low";
        default: return "priority-low";
      }
    };

    const getStatusIcon = (status: string): string => {
      switch (status.toLowerCase()) {
        case "under-investigation": return "🔍";
        case "rejected": return "❌";
        case "resolved": return "✅";
        case "pending": return "⏳";
        default: return "📋";
      }
    };

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Alert - Report Status Update - iReporter</title>
  <style>${this.getBaseStyles()}</style>
</head>
<body>
  <div class="email-wrapper">
    <!-- Header -->
    <div class="header">
      <div class="logo-badge">Admin Alert</div>
      <div class="logo-container">
        <img src="${logoUrl}" alt="iReporter Admin Logo" class="logo">
      </div>
      <h1 class="header-title">Report Status Updated</h1>
      <p class="header-subtitle">Administrative action required</p>
    </div>
    
    <!-- Content -->
    <div class="content">
      <!-- Critical Alert -->
      <div class="alert alert-warning">
        <strong>🚨 ADMINISTRATIVE ACTION REQUIRED:</strong> 
        <p class="mt-1">A report status change has been processed. Verification and documentation required.</p>
      </div>
      
      <!-- Quick Stats -->
      <div class="status-panel">
        <div class="status-card">
          <div class="status-label">Report Type</div>
          <div class="status-value" style="background: ${style.colors.primary}; color: white;">
            ${getStatusIcon(reportType)} ${reportType}
          </div>
        </div>
        
        <div class="status-card">
          <div class="status-label">Priority Level</div>
          <div class="status-value ${getPriorityClass(newStatus)}">
            ${getPriorityLevel(newStatus)}
          </div>
        </div>
      </div>
      
      <!-- Report Details Table -->
      <h3 class="mb-2 text-primary">Report Details</h3>
      <table class="data-table">
        <thead>
          <tr>
            <th>Field</th>
            <th>Details</th>
            <th>Metadata</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="label">Report ID</td>
            <td><code>#${Math.random().toString(36).substr(2, 9).toUpperCase()}</code></td>
            <td>Category: ${reportType}</td>
          </tr>
          <tr>
            <td class="label">Title</td>
            <td colspan="2">"${reportTitle}"</td>
          </tr>
          <tr>
            <td class="label">User</td>
            <td>${userEmail}</td>
            <td>ID: USR-${Math.random().toString(36).substr(2, 6).toUpperCase()}</td>
          </tr>
          <tr>
            <td class="label">Timestamp</td>
            <td>${new Date().toLocaleString('en-US', { 
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })}</td>
            <td>UTC ${new Date().getTimezoneOffset() / -60}</td>
          </tr>
          <tr>
            <td class="label">Change ID</td>
            <td><code>CHG-${Date.now().toString(36).toUpperCase()}</code></td>
            <td>Action: Status Update</td>
          </tr>
        </tbody>
      </table>
      
      <!-- Status Change Details -->
      <h3 class="mb-2 text-primary">Status Change Details</h3>
      <table class="data-table">
        <thead>
          <tr>
            <th>Status</th>
            <th>Value</th>
            <th>Time</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Previous</strong></td>
            <td>
              <span class="priority-badge">${oldStatus.toUpperCase()}</span>
              ${getStatusIcon(oldStatus)}
            </td>
            <td>${new Date(Date.now() - 3600000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
            <td>—</td>
          </tr>
          <tr>
            <td><strong>Current</strong></td>
            <td>
              <span class="priority-badge ${getPriorityClass(newStatus)}">
                ${newStatus.toUpperCase()}
              </span>
              ${getStatusIcon(newStatus)}
            </td>
            <td>${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
            <td><span class="priority-badge priority-high">UPDATED</span></td>
          </tr>
        </tbody>
      </table>
      
      <!-- System Actions Grid -->
      <h3 class="mb-2 text-primary">System Actions</h3>
      <div class="action-grid">
        <div class="action-card">
          <div class="action-icon">⚙️</div>
          <div class="action-title">Admin Panel</div>
          <div class="action-description">Access full administrative controls</div>
          <a href="${adminPanelUrl}" class="btn btn-primary">Open Panel</a>
        </div>
        
        <div class="action-card">
          <div class="action-icon">📋</div>
          <div class="action-title">Report Details</div>
          <div class="action-description">View complete report information</div>
          <a href="${reportDetailsUrl}" class="btn btn-secondary">View Report</a>
        </div>
        
        <div class="action-card">
          <div class="action-icon">📊</div>
          <div class="action-title">Audit Logs</div>
          <div class="action-description">Review system audit trail</div>
          <a href="${auditLogsUrl}" class="btn btn-secondary">View Logs</a>
        </div>
        
        <div class="action-card">
          <div class="action-icon">👤</div>
          <div class="action-title">User Profile</div>
          <div class="action-description">Access user information</div>
          <a href="${userProfileUrl}" class="btn btn-secondary">View User</a>
        </div>
      </div>
      
      <!-- System Audit Table -->
      <h3 class="mb-2 text-primary">System Audit Trail</h3>
      <table class="data-table">
        <thead>
          <tr>
            <th>Component</th>
            <th>Status</th>
            <th>Details</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Database</td>
            <td><span class="priority-badge priority-low">UPDATED</span></td>
            <td>Report status updated in primary DB</td>
            <td>${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
          </tr>
          <tr>
            <td>Notifications</td>
            <td><span class="priority-badge priority-low">SENT</span></td>
            <td>User notification dispatched</td>
            <td>${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
          </tr>
          <tr>
            <td>Audit System</td>
            <td><span class="priority-badge priority-low">LOGGED</span></td>
            <td>Change recorded in audit trail</td>
            <td>${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
          </tr>
          <tr>
            <td>Security</td>
            <td><span class="priority-badge priority-low">VERIFIED</span></td>
            <td>Security check passed</td>
            <td>${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
          </tr>
        </tbody>
      </table>
      
      <!-- Compliance Check -->
      <h3 class="mb-2 text-primary">Compliance Verification</h3>
      <table class="data-table">
        <thead>
          <tr>
            <th>Check</th>
            <th>Status</th>
            <th>Verified By</th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Policy Compliance</td>
            <td><span class="priority-badge priority-low">PASS</span></td>
            <td>System Validator</td>
            <td>Compliant with all policies</td>
          </tr>
          <tr>
            <td>Data Integrity</td>
            <td><span class="priority-badge priority-low">PASS</span></td>
            <td>Integrity Check v2.1</td>
            <td>Data integrity maintained</td>
          </tr>
          <tr>
            <td>Access Control</td>
            <td><span class="priority-badge priority-low">PASS</span></td>
            <td>Security Module</td>
            <td>Authorized access only</td>
          </tr>
          <tr>
            <td>Audit Requirements</td>
            <td><span class="priority-badge priority-low">PASS</span></td>
            <td>Audit System</td>
            <td>All requirements met</td>
          </tr>
        </tbody>
      </table>
      
      <!-- Important Alert -->
      <div class="alert alert-info">
        <strong>📋 Administrative Notes:</strong>
        <ul style="margin-left: 20px; margin-top: 8px;">
          <li>This action has been logged in the permanent audit trail</li>
          <li>The user (${userEmail}) has been notified automatically</li>
          <li>All system components have been updated</li>
          <li>Compliance verification completed successfully</li>
        </ul>
      </div>
    </div>
    
    <!-- Footer -->
    <div class="footer">
      <div class="footer-links">
        <a href="${adminPanelUrl}" class="footer-link">Admin Dashboard</a>
        <a href="${analyticsUrl}" class="footer-link">Analytics</a>
        <a href="${settingsUrl}" class="footer-link">Settings</a>
        <a href="${auditLogsUrl}" class="footer-link">Audit Logs</a>
        <a href="${userProfileUrl}" class="footer-link">User Management</a>
      </div>
      <div class="footer-copyright">
        <p>© ${new Date().getFullYear()} iReporter Admin System v2.4.1</p>
        <p>This is an automated administrative notification</p>
        <p style="opacity: 0.7; font-size: 11px; margin-top: 8px;">
          Notification ID: NT-${Date.now().toString(36).toUpperCase()} • 
          System: PROD-01 • 
          User: ${userEmail.split('@')[0]}
        </p>
      </div>
    </div>
  </div>
</body>
</html>
    `;
  }
}

export default EmailService;