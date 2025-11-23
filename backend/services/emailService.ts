import transporter from '../utils/email';  // ✅ CORRECT PATH

class EmailService {
  static async sendReportStatusNotification(
    userEmail: string, 
    reportType: string, // 'redflag', 'intervention'
    reportTitle: string,
    oldStatus: string, 
    newStatus: string
  ): Promise<void> {
    try {
      console.log('📧 Starting email send process...');
      console.log('📤 From:', process.env.EMAIL_USER);
      console.log('📨 To:', userEmail);
      console.log('📝 Report Type:', reportType);
      
      const reportTypeDisplay = reportType === 'redflag' ? 'Red Flag' : 'Intervention';
      
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: `${reportTypeDisplay} Status Update - iReporter`,
        html: this.createReportEmailTemplate(userEmail, reportType, reportTitle, oldStatus, newStatus)
      };

      console.log('🔄 Sending email via transporter...');
      const result = await transporter.sendMail(mailOptions);
      
      console.log('✅ Email sent successfully!');
      console.log('📧 Message ID:', result.messageId);
      console.log('📤 Response:', result.response);
      console.log(`✅ ${reportType} status email sent to: ${userEmail}`);
      
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
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Report Status Update</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 20px;
            min-height: 100vh;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        
        .email-header {
            background: linear-gradient(135deg, #007bff, #0056b3);
            color: white;
            padding: 40px 30px;
            text-align: center;
            position: relative;
        }
        
        .header-icon {
            font-size: 48px;
            margin-bottom: 15px;
        }
        
        .email-header h1 {
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 10px;
        }
        
        .email-header p {
            font-size: 16px;
            opacity: 0.9;
            font-weight: 300;
        }
        
        .email-body {
            padding: 50px 40px;
        }
        
        .greeting {
            font-size: 20px;
            margin-bottom: 25px;
            color: #2c3e50;
            font-weight: 600;
        }
        
        .report-info {
            background: #f8f9fa;
            border-radius: 10px;
            padding: 20px;
            margin: 20px 0;
        }
        
        .status-update-section {
            background: linear-gradient(135deg, #f8f9fa, #e9ecef);
            border-radius: 15px;
            padding: 30px;
            margin: 30px 0;
            border-left: 5px solid #007bff;
        }
        
        .status-title {
            text-align: center;
            color: #495057;
            margin-bottom: 25px;
            font-size: 20px;
            font-weight: 600;
        }
        
        .status-comparison {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 20px 0;
        }
        
        .status-item {
            text-align: center;
            flex: 1;
        }
        
        .status-label {
            font-weight: 600;
            color: #495057;
            margin-bottom: 10px;
            font-size: 14px;
        }
        
        .status-badge {
            padding: 12px 20px;
            border-radius: 25px;
            font-weight: 700;
            color: white;
            font-size: 16px;
            display: inline-block;
            min-width: 120px;
        }
        
        .change-arrow {
            color: #6c757d;
            font-size: 32px;
            font-weight: bold;
            margin: 0 20px;
        }
        
        .info-card {
            background: #e7f3ff;
            border-radius: 12px;
            padding: 25px;
            margin: 30px 0;
            border-left: 5px solid #17a2b8;
        }
        
        .action-section {
            text-align: center;
            margin: 35px 0;
        }
        
        .action-button {
            display: inline-block;
            background: linear-gradient(135deg, #28a745, #20c997);
            color: white;
            padding: 16px 40px;
            text-decoration: none;
            border-radius: 30px;
            font-weight: 700;
            font-size: 16px;
        }
        
        .contact-card {
            background: #fff3cd;
            border-radius: 12px;
            padding: 25px;
            margin: 30px 0;
            border-left: 5px solid #ffc107;
        }
        
        .email-footer {
            background: #343a40;
            color: white;
            padding: 30px 20px;
            text-align: center;
        }
        
        @media (max-width: 600px) {
            .email-body {
                padding: 30px 20px;
            }
            
            .status-comparison {
                flex-direction: column;
            }
            
            .change-arrow {
                margin: 15px 0;
                transform: rotate(90deg);
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="email-header">
            <div class="header-icon">📋</div>
            <h1>${displayType} Status Updated</h1>
            <p>Your ${displayType.toLowerCase()} status has been changed</p>
        </div>
        
        <!-- Body -->
        <div class="email-body">
            <div class="greeting">
                Hello <strong>${userEmail}</strong>,
            </div>
            
            <p style="color: #6c757d; line-height: 1.6; margin-bottom: 25px;">
                We're writing to inform you that your ${displayType.toLowerCase()} status has been updated by our administration team.
            </p>
            
            <!-- Report Info -->
            <div class="report-info">
                <p><strong>Report Title:</strong> ${reportTitle}</p>
                <p><strong>Report Type:</strong> ${displayType}</p>
            </div>
            
            <!-- Status Update Card -->
            <div class="status-update-section">
                <div class="status-title">Status Change Details</div>
                
                <div class="status-comparison">
                    <div class="status-item">
                        <div class="status-label">PREVIOUS STATUS</div>
                        <div class="status-badge" style="background: ${getStatusColor(oldStatus)};">
                            ${oldStatus.toUpperCase()}
                        </div>
                    </div>
                    
                    <div class="change-arrow">→</div>
                    
                    <div class="status-item">
                        <div class="status-label">NEW STATUS</div>
                        <div class="status-badge" style="background: ${getStatusColor(newStatus)};">
                            ${newStatus.toUpperCase()}
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Information Card -->
            <div class="info-card">
                <h3>💡 What This Means</h3>
                <p style="color: #495057; line-height: 1.6;">
                    This status change reflects the current state of your ${displayType.toLowerCase()}. 
                    Our team is working to address all reports in a timely manner.
                </p>
            </div>
            
            <!-- Action Button -->
            <div class="action-section">
                <a href="#" class="action-button">View Your Report</a>
            </div>
            
            <!-- Contact Card -->
            <div class="contact-card">
                <h3>📞 Need Assistance?</h3>
                <p>Contact our support team:</p>
                <p>📧 support@ireporter.com</p>
                <p>📱 +1 (555) 123-4567</p>
            </div>
        </div>
        
        <!-- Footer -->
        <div class="email-footer">
            <div style="font-size: 24px; font-weight: bold; margin-bottom: 15px; color: #17a2b8;">iReporter</div>
            <p>Keeping communities safe and informed through collaborative reporting</p>
            <div style="margin-top: 15px; font-size: 14px; opacity: 0.8;">
                &copy; ${new Date().getFullYear()} iReporter. All rights reserved.
            </div>
        </div>
    </div>
</body>
</html>
    `;
  }
}

export default EmailService;