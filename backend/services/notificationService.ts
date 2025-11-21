// services/notificationService.ts
import nodemailer from 'nodemailer';

interface ItemDetails {
  name: string;
  id: string;
}

class NotificationService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async sendStatusChangeEmail(
    userEmail: string, 
    oldStatus: string, 
    newStatus: string, 
    itemDetails: ItemDetails
  ): Promise<boolean> {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: 'Status Update Notification - iReporter',
      html: this.generateStatusChangeEmail(oldStatus, newStatus, itemDetails)
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Email sent to ${userEmail}`);
      return true;
    } catch (error) {
      console.error('❌ Error sending email:', error);
      return false;
    }
  }

  // ✅ NEW: Admin-specific email method
  async sendAdminStatusChangeEmail(
    adminEmail: string,
    userEmail: string,
    oldStatus: string, 
    newStatus: string,
    itemDetails: ItemDetails
  ): Promise<boolean> {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: adminEmail,
      subject: 'ADMIN COPY - Status Update Notification - iReporter',
      html: this.generateAdminStatusChangeEmail(userEmail, oldStatus, newStatus, itemDetails)
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Admin email sent to ${adminEmail}`);
      return true;
    } catch (error) {
      console.error('❌ Error sending admin email:', error);
      return false;
    }
  }

  private generateStatusChangeEmail(
    oldStatus: string, 
    newStatus: string, 
    itemDetails: ItemDetails
  ): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; }
          .status-box { background: white; padding: 15px; border-left: 4px solid #4CAF50; margin: 15px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          .status-badge { 
            display: inline-block; 
            padding: 5px 10px; 
            border-radius: 3px; 
            color: white; 
            font-weight: bold; 
            margin: 0 5px;
          }
          .old-status { background: #ff9800; }
          .new-status { background: #4CAF50; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>iReporter - Status Update</h2>
          </div>
          <div class="content">
            <p>Hello,</p>
            <p>Your report status has been updated by the administrator:</p>
            
            <div class="status-box">
              <p><strong>Report Title:</strong> ${itemDetails.name || 'N/A'}</p>
              <p><strong>Report ID:</strong> ${itemDetails.id || 'N/A'}</p>
              <p><strong>Status Changed:</strong> 
                <span class="status-badge old-status">${oldStatus}</span> 
                → 
                <span class="status-badge new-status">${newStatus}</span>
              </p>
              <p><strong>Update Time:</strong> ${new Date().toLocaleString()}</p>
            </div>
            
            <p>Please log in to your iReporter account to view more details and take any necessary action.</p>
            
            <p>Best regards,<br>iReporter Team</p>
          </div>
          <div class="footer">
            <p>This is an automated notification. Please do not reply to this email.</p>
            <p>&copy; ${new Date().getFullYear()} iReporter. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // ✅ NEW: Admin-specific email template
  private generateAdminStatusChangeEmail(
    userEmail: string,
    oldStatus: string, 
    newStatus: string, 
    itemDetails: ItemDetails
  ): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #ff9800; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; }
          .status-box { background: white; padding: 15px; border-left: 4px solid #ff9800; margin: 15px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          .status-badge { 
            display: inline-block; 
            padding: 5px 10px; 
            border-radius: 3px; 
            color: white; 
            font-weight: bold; 
            margin: 0 5px;
          }
          .old-status { background: #ff9800; }
          .new-status { background: #4CAF50; }
          .admin-note { background: #e7f3ff; padding: 10px; border-radius: 5px; margin: 10px 0; }
          .user-email { color: #666; font-style: italic; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>🚨 ADMIN COPY - iReporter Status Update</h2>
          </div>
          <div class="content">
            <p>Hello Admin,</p>
            <p><strong>You have updated a report status:</strong></p>
            
            <div class="status-box">
              <p><strong>📋 Report Title:</strong> ${itemDetails.name || 'N/A'}</p>
              <p><strong>🆔 Report ID:</strong> ${itemDetails.id || 'N/A'}</p>
              <p><strong>👤 User Email:</strong> <span class="user-email">${userEmail || 'Not available'}</span></p>
              <p><strong>🔄 Status Changed:</strong> 
                <span class="status-badge old-status">${oldStatus}</span> 
                → 
                <span class="status-badge new-status">${newStatus}</span>
              </p>
              <p><strong>⏰ Update Time:</strong> ${new Date().toLocaleString()}</p>
            </div>
            
            <div class="admin-note">
              <p><strong>📝 Admin Note:</strong> This is your admin copy. The user has also been notified of this status change.</p>
            </div>
          </div>
          <div class="footer">
            <p>This is an automated admin notification. Please do not reply to this email.</p>
            <p>&copy; ${new Date().getFullYear()} iReporter. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

export default new NotificationService();