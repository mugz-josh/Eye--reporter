import transporter from '../utils/email';  // ✅ make sure path is correct

class EmailService {
  /**
   * Send report status notification to one or more recipients
   * @param userEmails string or array of strings (emails)
   */
  static async sendReportStatusNotification(
    userEmails: string | string[], // now accepts string or string[]
    reportType: string,           // 'redflag' or 'intervention'
    reportTitle: string,
    oldStatus: string,
    newStatus: string
  ): Promise<void> {
    try {
      console.log('📧 Starting email send process...');
      console.log('📤 To:', userEmails);

      const reportTypeDisplay = reportType === 'redflag' ? 'Red Flag' : 'Intervention';

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmails, // Nodemailer supports string or string[]
        subject: `${reportTypeDisplay} Status Update - iReporter`,
        html: this.createReportEmailTemplate(
          Array.isArray(userEmails) ? userEmails.join(', ') : userEmails,
          reportType,
          reportTitle,
          oldStatus,
          newStatus
        )
      };

      console.log('🔄 Sending email via transporter...');
      const result = await transporter.sendMail(mailOptions);

      console.log('✅ Email sent successfully!');
      console.log('📧 Message ID:', result.messageId);
      console.log('📤 Response:', result.response);
      console.log(`✅ ${reportType} status email sent to: ${Array.isArray(userEmails) ? userEmails.join(', ') : userEmails}`);
      
    } catch (error) {
      console.error(`❌ Error sending ${reportType} email:`, error);
      throw error;
    }
  }

  private static createReportEmailTemplate(
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
<title>${displayType} Status Update</title>
<style>
  body { font-family: Arial, sans-serif; background: #f8f9fa; margin: 0; padding: 0; }
  .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
  .header { background: #007bff; color: white; text-align: center; padding: 30px; }
  .header h1 { margin: 0; font-size: 24px; }
  .body { padding: 30px; }
  .status { display: flex; justify-content: space-between; margin: 20px 0; }
  .status-item { text-align: center; flex: 1; }
  .status-badge { padding: 10px 20px; border-radius: 25px; color: white; font-weight: bold; display: inline-block; min-width: 100px; }
  .info { background: #e7f3ff; padding: 20px; border-radius: 10px; margin-bottom: 20px; }
  .footer { background: #343a40; color: white; text-align: center; padding: 20px; font-size: 12px; }
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <h1>${displayType} Status Updated</h1>
    <p>Hello <strong>${userEmail}</strong>, your report status has changed.</p>
  </div>
  <div class="body">
    <p>Report Title: <strong>${reportTitle}</strong></p>
    <p>Report Type: <strong>${displayType}</strong></p>
    
    <div class="status">
      <div class="status-item">
        <p>Previous Status</p>
        <div class="status-badge" style="background:${getStatusColor(oldStatus)}">${oldStatus.toUpperCase()}</div>
      </div>
      <div class="status-item">
        <p>New Status</p>
        <div class="status-badge" style="background:${getStatusColor(newStatus)}">${newStatus.toUpperCase()}</div>
      </div>
    </div>

    <div class="info">
      <p>This change reflects the current state of your report. Our team is addressing all reports in a timely manner.</p>
    </div>
  </div>
  <div class="footer">
    &copy; ${new Date().getFullYear()} iReporter. All rights reserved.
  </div>
</div>
</body>
</html>
    `;
  }
}

export default EmailService;
