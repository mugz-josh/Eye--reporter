import transporter from '../utils/email';

class EmailService {
  /**
   * Send report status notification to user AND admin
   * @param userEmail string - the user's email
   * @param reportType 'redflag' | 'intervention'
   */
  static async sendReportStatusNotification(
    userEmail: string,
    reportType: string,
    reportTitle: string,
    oldStatus: string,
    newStatus: string
  ): Promise<void> {
    try {
      console.log('📧 Starting email send process...');
      
      // Get YOUR email from environment variables
      const adminEmail = process.env.ADMIN_EMAIL || 'joshua.mugisha.upti@gmail.com';
      
      console.log('📤 To User:', userEmail);
      console.log('📤 To Admin (YOU):', adminEmail);

      const reportTypeDisplay = reportType === 'redflag' ? 'Red Flag' : 'Intervention';

      // 1. Send email to USER
      const userMailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: `Your ${reportTypeDisplay} Status Has Been Updated - iReporter`,
        html: this.createUserEmailTemplate(
          userEmail,
          reportType,
          reportTitle,
          oldStatus,
          newStatus
        )
      };

      // 2. Send email to YOU (ADMIN)
      const adminMailOptions = {
        from: process.env.EMAIL_USER,
        to: adminEmail,
        subject: `[ADMIN] ${reportTypeDisplay} Status Changed - iReporter`,
        html: this.createAdminEmailTemplate(
          userEmail,
          reportType,
          reportTitle,
          oldStatus,
          newStatus
        )
      };

      console.log('🔄 Sending emails...');
      
      // Send both emails
      const [userResult, adminResult] = await Promise.all([
        transporter.sendMail(userMailOptions),
        transporter.sendMail(adminMailOptions)
      ]);

      console.log('✅ ALL emails sent successfully!');
      console.log('📧 User Message ID:', userResult.messageId);
      console.log('📧 Admin Message ID:', adminResult.messageId);
      console.log(`✅ ${reportType} status email sent to user: ${userEmail}`);
      console.log(`✅ ${reportType} notification sent to YOU (admin): ${adminEmail}`);
      
    } catch (error) {
      console.error(`❌ Error sending ${reportType} emails:`, error);
      throw error;
    }
  }

  private static createUserEmailTemplate(
    userEmail: string,
    reportType: string,
    reportTitle: string,
    oldStatus: string,
    newStatus: string
  ): string {
    const reportTypeNames: { [key: string]: string } = {
      'redflag': 'Red Flag Report',
      'intervention': 'Intervention Request'
    };

    const statusColors: { [key: string]: string } = {
      'draft': '#6c757d',
      'under-investigation': '#ffc107',
      'resolved': '#28a745',
      'rejected': '#dc3545'
    };

    const getStatusColor = (status: string): string => {
      return statusColors[status.toLowerCase()] || '#6c757d';
    };

    const displayType = reportTypeNames[reportType] || reportType;

    return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Your ${displayType} Status Update</title>
<style>
  /* Classic Corporate CSS */
  body {
    font-family: 'Helvetica Neue', Arial, sans-serif;
    background-color: #f8f9fa;
    margin: 0;
    padding: 20px;
    line-height: 1.5;
    color: #333333;
  }
  
  .email-wrapper {
    max-width: 600px;
    margin: 0 auto;
    background: #ffffff;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
  
  .email-header {
    background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
    color: #ffffff;
    padding: 30px;
    text-align: center;
    border-bottom: 4px solid #1d4ed8;
  }
  
  .email-header h1 {
    font-size: 22px;
    font-weight: 600;
    margin: 0 0 8px 0;
    letter-spacing: 0.5px;
  }
  
  .email-header p {
    font-size: 14px;
    margin: 0;
    opacity: 0.9;
    font-weight: 300;
  }
  
  .email-body {
    padding: 0;
  }
  
  .section {
    padding: 24px 30px;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .section:last-child {
    border-bottom: none;
  }
  
  .section-title {
    font-size: 15px;
    color: #1e40af;
    font-weight: 600;
    margin-bottom: 16px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 2px solid #e5e7eb;
    padding-bottom: 8px;
  }
  
  .info-grid {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 1px;
    background: #e5e7eb;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    overflow: hidden;
  }
  
  .info-item {
    display: contents;
  }
  
  .info-label {
    background: #f8fafc;
    padding: 12px 16px;
    font-weight: 600;
    color: #374151;
    font-size: 13px;
    border-right: 1px solid #e5e7eb;
  }
  
  .info-value {
    background: #ffffff;
    padding: 12px 16px;
    color: #6b7280;
    font-size: 13px;
  }
  
  .status-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    margin: 20px 0;
  }
  
  .status-column {
    flex: 1;
    text-align: center;
  }
  
  .status-label {
    font-size: 12px;
    color: #6b7280;
    margin-bottom: 8px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .status-badge {
    padding: 10px 16px;
    border-radius: 4px;
    color: #ffffff;
    font-weight: 600;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    display: inline-block;
    min-width: 120px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }
  
  .status-arrow {
    color: #9ca3af;
    font-size: 18px;
    font-weight: bold;
  }
  
  .notes-panel {
    background: #f0f9ff;
    border: 1px solid #bae6fd;
    border-radius: 6px;
    padding: 20px;
    margin: 20px 0;
  }
  
  .notes-title {
    font-weight: 600;
    color: #0369a1;
    margin-bottom: 8px;
    font-size: 14px;
  }
  
  .notes-content {
    color: #475569;
    font-size: 13px;
    line-height: 1.5;
  }
  
  .notes-content p {
    margin: 6px 0;
  }
  
  .email-footer {
    background: #1f2937;
    color: #d1d5db;
    padding: 24px 30px;
    text-align: center;
    border-top: 4px solid #374151;
  }
  
  .footer-title {
    font-weight: 600;
    color: #ffffff;
    margin-bottom: 4px;
    font-size: 14px;
  }
  
  .footer-subtitle {
    font-size: 12px;
    margin-bottom: 12px;
    opacity: 0.8;
  }
  
  .copyright {
    font-size: 11px;
    color: #9ca3af;
    margin-top: 12px;
  }
  
  /* Responsive Design */
  @media (max-width: 480px) {
    body {
      padding: 12px;
    }
    
    .email-header {
      padding: 24px 20px;
    }
    
    .email-header h1 {
      font-size: 20px;
    }
    
    .section {
      padding: 20px;
    }
    
    .info-grid {
      grid-template-columns: 1fr;
    }
    
    .info-label {
      border-right: none;
      border-bottom: 1px solid #e5e7eb;
    }
    
    .status-container {
      flex-direction: column;
      gap: 16px;
    }
    
    .status-arrow {
      transform: rotate(90deg);
    }
  }
</style>
</head>
<body>
<div class="email-wrapper">
  <!-- Header -->
  <div class="email-header">
    <h1>STATUS UPDATE NOTIFICATION</h1>
    <p>Your ${displayType} Report Status Has Been Updated</p>
  </div>
  
  <!-- Body -->
  <div class="email-body">
    <!-- User Information -->
    <div class="section">
      <div class="section-title">Report Information</div>
      <div class="info-grid">
        <div class="info-item">
          <div class="info-label">Report Title</div>
          <div class="info-value">${reportTitle}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Report Type</div>
          <div class="info-value">${displayType}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Your Email</div>
          <div class="info-value">${userEmail}</div>
        </div>
      </div>
    </div>
    
    <!-- Status Comparison -->
    <div class="section">
      <div class="section-title">Status Transition</div>
      <div class="status-container">
        <div class="status-column">
          <div class="status-label">Previous Status</div>
          <div class="status-badge" style="background:${getStatusColor(oldStatus)}">
            ${oldStatus.toUpperCase()}
          </div>
        </div>
        <div class="status-arrow">→</div>
        <div class="status-column">
          <div class="status-label">Current Status</div>
          <div class="status-badge" style="background:${getStatusColor(newStatus)}">
            ${newStatus.toUpperCase()}
          </div>
        </div>
      </div>
    </div>
    
    <!-- Additional Information -->
    <div class="section">
      <div class="section-title">Additional Information</div>
      <div class="notes-panel">
        <div class="notes-title">What This Status Change Means</div>
        <div class="notes-content">
          <p>This status update reflects the current progress of your ${displayType.toLowerCase()}. Our team is actively working to review and address all submitted reports in a timely manner.</p>
          <p>If you have any questions or require further clarification regarding this status change, please do not hesitate to contact our support team for assistance.</p>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Footer -->
  <div class="email-footer">
    <div class="footer-title">iReporter Platform</div>
    <div class="footer-subtitle">Building Transparent and Accountable Communities</div>
    <div class="copyright">&copy; ${new Date().getFullYear()} iReporter. All rights reserved.</div>
  </div>
</div>
</body>
</html>
    `;
  }

  private static createAdminEmailTemplate(
    userEmail: string,
    reportType: string,
    reportTitle: string,
    oldStatus: string,
    newStatus: string
  ): string {
    const reportTypeNames: { [key: string]: string } = {
      'redflag': 'Red Flag Report',
      'intervention': 'Intervention Request'
    };

    const statusColors: { [key: string]: string } = {
      'draft': '#6c757d',
      'under-investigation': '#ffc107',
      'resolved': '#28a745',
      'rejected': '#dc3545'
    };

    const getStatusColor = (status: string): string => {
      return statusColors[status.toLowerCase()] || '#6c757d';
    };

    const displayType = reportTypeNames[reportType] || reportType;

    return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>ADMIN: ${displayType} Status Update</title>
<style>
  /* Classic Corporate Admin CSS */
  body {
    font-family: 'Helvetica Neue', Arial, sans-serif;
    background-color: #f8f9fa;
    margin: 0;
    padding: 20px;
    line-height: 1.5;
    color: #333333;
  }
  
  .email-wrapper {
    max-width: 650px;
    margin: 0 auto;
    background: #ffffff;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }
  
  .email-header {
    background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
    color: #ffffff;
    padding: 28px 30px;
    text-align: center;
    border-bottom: 4px solid #991b1b;
    position: relative;
  }
  
  .admin-badge {
    background: rgba(255,255,255,0.2);
    color: #ffffff;
    padding: 6px 16px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    display: inline-block;
    margin-bottom: 12px;
    border: 1px solid rgba(255,255,255,0.3);
  }
  
  .email-header h1 {
    font-size: 20px;
    font-weight: 600;
    margin: 0 0 6px 0;
    letter-spacing: 0.5px;
  }
  
  .email-header p {
    font-size: 13px;
    margin: 0;
    opacity: 0.9;
    font-weight: 300;
  }
  
  .email-body {
    padding: 0;
  }
  
  .section {
    padding: 24px 30px;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .section:last-child {
    border-bottom: none;
  }
  
  .section-title {
    font-size: 14px;
    color: #dc2626;
    font-weight: 600;
    margin-bottom: 16px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 2px solid #e5e7eb;
    padding-bottom: 8px;
  }
  
  .info-grid {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 1px;
    background: #e5e7eb;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    overflow: hidden;
  }
  
  .info-item {
    display: contents;
  }
  
  .info-label {
    background: #f8fafc;
    padding: 12px 16px;
    font-weight: 600;
    color: #374151;
    font-size: 12px;
    border-right: 1px solid #e5e7eb;
  }
  
  .info-value {
    background: #ffffff;
    padding: 12px 16px;
    color: #6b7280;
    font-size: 12px;
    font-family: 'Monaco', 'Consolas', monospace;
  }
  
  .status-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    margin: 20px 0;
  }
  
  .status-column {
    flex: 1;
    text-align: center;
  }
  
  .status-label {
    font-size: 11px;
    color: #6b7280;
    margin-bottom: 8px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .status-badge {
    padding: 10px 16px;
    border-radius: 4px;
    color: #ffffff;
    font-weight: 600;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    display: inline-block;
    min-width: 120px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }
  
  .status-arrow {
    color: #9ca3af;
    font-size: 18px;
    font-weight: bold;
    background: #f3f4f6;
    padding: 8px;
    border-radius: 50%;
  }
  
  .system-panel {
    background: #1f2937;
    color: #e5e7eb;
    border-radius: 6px;
    padding: 20px;
    margin: 20px 0;
    border-left: 4px solid #dc2626;
  }
  
  .system-title {
    font-weight: 600;
    color: #ffffff;
    margin-bottom: 8px;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .system-content {
    font-size: 12px;
    line-height: 1.5;
    font-family: 'Monaco', 'Consolas', monospace;
  }
  
  .admin-notes {
    background: #fffbeb;
    border: 1px solid #fcd34d;
    border-radius: 6px;
    padding: 20px;
    margin: 20px 0;
  }
  
  .notes-title {
    font-weight: 600;
    color: #92400e;
    margin-bottom: 8px;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .notes-content {
    color: #92400e;
    font-size: 12px;
    line-height: 1.5;
  }
  
  .notes-content p {
    margin: 6px 0;
  }
  
  .email-footer {
    background: #111827;
    color: #9ca3af;
    padding: 24px 30px;
    text-align: center;
    border-top: 4px solid #dc2626;
  }
  
  .footer-title {
    font-weight: 600;
    color: #ffffff;
    margin-bottom: 4px;
    font-size: 13px;
  }
  
  .footer-subtitle {
    font-size: 11px;
    margin-bottom: 12px;
    opacity: 0.8;
  }
  
  .confidential {
    font-size: 10px;
    color: #ef4444;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-top: 12px;
    border: 1px solid #ef4444;
    padding: 6px 12px;
    border-radius: 4px;
    display: inline-block;
  }
  
  .copyright {
    font-size: 10px;
    color: #6b7280;
    margin-top: 12px;
  }
  
  /* Responsive Design */
  @media (max-width: 480px) {
    body {
      padding: 12px;
    }
    
    .email-header {
      padding: 20px;
    }
    
    .email-header h1 {
      font-size: 18px;
    }
    
    .section {
      padding: 20px;
    }
    
    .info-grid {
      grid-template-columns: 1fr;
    }
    
    .info-label {
      border-right: none;
      border-bottom: 1px solid #e5e7eb;
    }
    
    .status-container {
      flex-direction: column;
      gap: 16px;
    }
    
    .status-arrow {
      transform: rotate(90deg);
    }
  }
</style>
</head>
<body>
<div class="email-wrapper">
  <!-- Header -->
  <div class="email-header">
    <div class="admin-badge">Administrative Notification</div>
    <h1>SYSTEM STATUS UPDATE</h1>
    <p>${displayType} Report Status Modification</p>
  </div>
  
  <!-- Body -->
  <div class="email-body">
    <!-- User Information -->
    <div class="section">
      <div class="section-title">User & Report Information</div>
      <div class="info-grid">
        <div class="info-item">
          <div class="info-label">User Email</div>
          <div class="info-value">${userEmail}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Report Title</div>
          <div class="info-value">${reportTitle}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Report Type</div>
          <div class="info-value">${displayType}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Report ID</div>
          <div class="info-value">${Math.random().toString(36).substr(2, 9).toUpperCase()}</div>
        </div>
      </div>
    </div>
    
    <!-- Status Comparison -->
    <div class="section">
      <div class="section-title">Status Transition</div>
      <div class="status-container">
        <div class="status-column">
          <div class="status-label">Previous Status</div>
          <div class="status-badge" style="background:${getStatusColor(oldStatus)}">
            ${oldStatus.toUpperCase()}
          </div>
        </div>
        <div class="status-arrow">→</div>
        <div class="status-column">
          <div class="status-label">Current Status</div>
          <div class="status-badge" style="background:${getStatusColor(newStatus)}">
            ${newStatus.toUpperCase()}
          </div>
        </div>
      </div>
    </div>
    
    <!-- System Information -->
    <div class="section">
      <div class="section-title">System Information</div>
      <div class="system-panel">
        <div class="system-title">System Timestamp</div>
        <div class="system-content">
          ${new Date().toLocaleString()} (UTC${new Date().getTimezoneOffset() > 0 ? '-' : '+'}${Math.abs(new Date().getTimezoneOffset()/60)})
        </div>
      </div>
    </div>
    
    <!-- Administrative Notes -->
    <div class="section">
      <div class="section-title">Administrative Notes</div>
      <div class="admin-notes">
        <div class="notes-title">System Action Summary</div>
        <div class="notes-content">
          <p>This is an automated administrative notification generated by the iReporter system.</p>
          <p>The user (${userEmail}) has been automatically notified of this status change via email.</p>
          <p>This status modification was processed through the standard system workflow.</p>
          <p><em>No further action is required unless specifically indicated by system protocols.</em></p>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Footer -->
  <div class="email-footer">
    <div class="footer-title">iReporter Administrative System</div>
    <div class="footer-subtitle">Automated Notification Service</div>
    <div class="confidential">Confidential - Authorized Personnel Only</div>
    <div class="copyright">&copy; ${new Date().getFullYear()} iReporter Admin. All rights reserved.</div>
  </div>
</div>
</body>
</html>
    `;
  }
}

export default EmailService;