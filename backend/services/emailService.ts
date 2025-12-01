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
  // USER EMAIL TEMPLATE (Professional + Branded + Footer)
  // ================================================================
  private static createUserEmailTemplate(
    userEmail: string,
    reportType: string,
    reportTitle: string,
    oldStatus: string,
    newStatus: string
  ): string {
    const brandColor = "#2c3e50";
    const logoUrl = "https://i.imgur.com/your-logo.png"; // Replace with actual logo URL

    const supportEmail = "support@ireporter.com";
    const helpCenterUrl = "https://ireporter.com/help";
    const privacyPolicyUrl = "https://ireporter.com/privacy";
    const termsUrl = "https://ireporter.com/terms";

    return `
<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family:'Helvetica Neue',Helvetica,Arial,sans-serif; background:#f6f9fc; margin:0; padding:0; }
  .email-wrapper { max-width:650px; margin:30px auto; background:#fff; border-radius:12px; padding:30px; box-shadow:0 6px 20px rgba(0,0,0,0.08);}
  .header { text-align:center; padding-bottom:20px; border-bottom:2px solid #f0f0f0;}
  .header img { width:120px; margin-bottom:10px;}
  .header h2 { margin:0; font-size:26px; font-weight:bold; color:${brandColor}; }
  .subtext { font-size:14px; color:#8898aa; }
  .content { margin-top:25px; font-size:15px; color:#34495e; line-height:1.6; }
  .info-card { background:#f8fafc; padding:18px; border-left:4px solid ${brandColor}; margin-top:15px; border-radius:6px; }
  .status-box { margin-top:25px; background:#eef6ff; padding:14px; border-radius:10px; border-left:5px solid ${brandColor}; }
  .status-label { font-size:14px; color:#555; }
  .status-badge { display:inline-block; padding:8px 14px; border-radius:8px; font-weight:bold; margin-left:10px; }
  .new-status { background:${brandColor}; color:#fff; }
  .old-status { background:#d0d7de; color:#333; }
  .btn { display:inline-block; padding:12px 22px; margin:10px 5px 0 0; text-decoration:none; border-radius:8px; color:#fff; font-weight:bold; }
  .btn-primary { background-color:${brandColor}; }
  .btn-secondary { background-color:#95a5a6; }
  .footer { margin-top:35px; padding-top:20px; border-top:2px solid #f0f0f0; text-align:center; color:#95a5a6; font-size:13px; line-height:1.5; }
  .footer a { color:#2c3e50; text-decoration:none; }
  @media (max-width:600px) { .email-wrapper { padding:20px; } .header h2 { font-size:22px; } }
</style>
</head>
<body>
  <div class="email-wrapper">
    <div class="header">
      <img src="${logoUrl}" alt="iReporter Logo">
      <h2>Report Status Update</h2>
      <div class="subtext">iReporter Notification System</div>
    </div>

    <div class="content">
      Hello <strong>${userEmail}</strong>,<br><br>
      Your <strong>${reportType}</strong> report titled:
      <div class="info-card"><strong>${reportTitle}</strong></div>
      has been updated by the admin.
      
      <div class="status-box">
        <div class="status-label">Previous Status: <span class="status-badge old-status">${oldStatus}</span></div><br>
        <div class="status-label">New Status: <span class="status-badge new-status">${newStatus}</span></div>
      </div>

      <div style="margin-top:20px;">
        <a href="#" class="btn btn-primary">View Report Details</a>
        <a href="#" class="btn btn-secondary">Contact Support</a>
      </div>
    </div>

    <div class="footer">
      Need help? Contact us at <a href="mailto:${supportEmail}">${supportEmail}</a><br>
      <a href="${helpCenterUrl}">Help Center</a> • 
      <a href="${privacyPolicyUrl}">Privacy Policy</a> • 
      <a href="${termsUrl}">Terms of Service</a><br>
      &copy; ${new Date().getFullYear()} iReporter. All rights reserved.
    </div>
  </div>
</body>
</html>
    `;
  }

  // ================================================================
  // ADMIN EMAIL TEMPLATE (Professional & Branded)
  // ================================================================
  private static createAdminEmailTemplate(
    userEmail: string,
    reportType: string,
    reportTitle: string,
    oldStatus: string,
    newStatus: string
  ): string {
    const brandColor = "#2c3e50";
    const logoUrl = "https://i.imgur.com/your-logo.png";

    // Determine priority color
    const priorityColor =
      newStatus === "under-investigation" ? "#e74c3c" :
      newStatus === "rejected" ? "#f39c12" :
      "#27ae60"; // resolved/low priority

    return `
<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family:'Helvetica Neue',Helvetica,Arial,sans-serif; background:#f4f4f4; margin:0; padding:25px; }
  .email-box { background:#fff; padding:25px; max-width:650px; margin:auto; border-radius:10px; box-shadow:0 4px 15px rgba(0,0,0,0.08); }
  .header { text-align:center; margin-bottom:20px; }
  .header img { width:100px; }
  .header h2 { color:${brandColor}; margin:10px 0 0 0; font-size:22px; }
  .content { margin-top:20px; color:#333; font-size:15px; line-height:1.6; }
  .info { background:#f7f7f7; padding:15px; border-radius:6px; margin-top:15px; }
  .badge { display:inline-block; padding:6px 12px; border-radius:6px; font-weight:bold; margin-left:10px; }
  .new { background:${priorityColor}; color:#fff; }
  .old { background:#ccc; color:#333; }
  .btn { display:inline-block; padding:12px 20px; margin:10px 5px 0 0; text-decoration:none; border-radius:8px; font-weight:bold; color:#fff; }
  .btn-primary { background:${brandColor}; }
  .btn-secondary { background:#95a5a6; }
  .footer { margin-top:30px; text-align:center; font-size:12px; color:#777; }
  @media (max-width:600px) { .email-box { padding:20px; } .header h2 { font-size:20px; } }
</style>
</head>
<body>
  <div class="email-box">
    <div class="header">
      <img src="${logoUrl}" alt="iReporter Logo">
      <h2>Admin Report Notification</h2>
    </div>
    <div class="content">
      <strong>User:</strong> ${userEmail}<br>
      <strong>Report Type:</strong> ${reportType}<br>
      <strong>Title:</strong>
      <div class="info"><strong>${reportTitle}</strong></div>
      <br>
      <strong>Status Update:</strong><br>
      Previous: <span class="badge old">${oldStatus}</span><br>
      Current: <span class="badge new">${newStatus}</span><br><br>
      <strong>Priority:</strong> <span class="badge" style="background:${priorityColor}; color:#fff;">
        ${newStatus === "under-investigation" ? "HIGH" : newStatus === "rejected" ? "MEDIUM" : "LOW"}
      </span><br><br>
      <a href="#" class="btn btn-primary">Open Admin Panel</a>
      <a href="#" class="btn btn-secondary">View User Profile</a>
      <a href="#" class="btn btn-secondary">Audit Logs</a>
    </div>
    <div class="footer">
      iReporter Admin System &copy; ${new Date().getFullYear()} | All rights reserved.
    </div>
  </div>
</body>
</html>
    `;
  }
}

export default EmailService;
