import dotenv from 'dotenv';
import EmailService from './services/emailService'; // adjust path if needed

dotenv.config();

async function test() {
  try {
    const userEmail = 'abdul.kibirango@upti.com';     // user email
    const adminEmail = 'joshua.mugisha.upti@gmail.com'; // admin email
    const reportType = 'redflag';                     
    const reportTitle = 'Test Report';
    const oldStatus = 'draft';
    const newStatus = 'resolved';

    console.log('🚀 Sending test email to user and admin...');

    await EmailService.sendReportStatusNotification(
      [userEmail, adminEmail],  // ← send to both
      reportType,
      reportTitle,
      oldStatus,
      newStatus
    );

    console.log('✅ Test email function executed. Check both inboxes!');
  } catch (error) {
    console.error('❌ Test email failed:', error);
  }
}

test();
