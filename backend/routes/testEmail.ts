// routes/testEmail.ts
import express, { Request, Response } from 'express';
import NotificationService from '../services/notificationService';

const router = express.Router();

// Test email endpoint
router.get('/test-email', async (req: Request, res: Response) => {
  try {
    // ⚠️ CHANGE THIS TO YOUR ACTUAL EMAIL WHERE YOU WANT TO RECEIVE TEST
    const testEmail = 'joshua.mugisha.upti@gmail.com'; // or another email
    
    console.log('📧 Testing email configuration...');
    console.log('Email Service:', process.env.EMAIL_SERVICE);
    console.log('Email User:', process.env.EMAIL_USER);
    
    const result = await NotificationService.sendStatusChangeEmail(
      testEmail,
      'pending',
      'approved',
      { name: 'Test Report - Water Leakage', id: 'REP-12345' }
    );

    if (result) {
      res.json({ 
        success: true, 
        message: '✅ Test email sent successfully! Please check your inbox.' 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: '❌ Failed to send test email. Check server logs.' 
      });
    }
  } catch (error) {
    console.error('❌ Test email error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error sending test email: ' + (error as Error).message 
    });
  }
});

export default router;