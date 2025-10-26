import nodemailer from 'nodemailer';
import { logger } from '../utils/logger';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.hostinger.com',
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: process.env.SMTP_SECURE !== 'false', // SSL/TLS enabled by default
  auth: {
    user: process.env.SMTP_USER || 'promohive@globalpromonetwork.store',
    pass: process.env.SMTP_PASS,
  },
});

export const sendWelcomeEmail = async (email: string, fullName: string) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@promohive.com',
      to: email,
      subject: 'Welcome to PromoHive - Account Under Review',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
            <h1 style="margin: 0; font-size: 28px;">Welcome to PromoHive</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Global Promo Network</p>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333; margin-bottom: 20px;">Hello ${fullName}!</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Thank you for registering with PromoHive! Your account has been created successfully.
            </p>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h3 style="color: #856404; margin: 0 0 10px 0;">⏳ Account Under Review</h3>
              <p style="color: #856404; margin: 0; line-height: 1.5;">
                Your account is currently under review by our admin team. You will receive an email notification once your account is approved and you can start earning!
              </p>
            </div>
            
            <p style="color: #666; line-height: 1.6;">
              Once approved, you'll receive a $5 welcome bonus and can start completing tasks to earn money.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.PLATFORM_URL || 'http://localhost:3000'}" 
                 style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Visit PromoHive
              </a>
            </div>
          </div>
          
          <div style="text-align: center; padding: 20px; background: #f8f9fa; color: #666; font-size: 14px;">
            <p style="margin: 0;">© 2024 PromoHive. All rights reserved.</p>
            <p style="margin: 5px 0 0 0;">Global Promo Network</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    logger.info(`Welcome email sent to ${email}`);
  } catch (error) {
    logger.error('Failed to send welcome email:', error);
    throw error;
  }
};

export const sendApprovalEmail = async (email: string, fullName: string) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@promohive.com',
      to: email,
      subject: 'PromoHive Account Approved - Start Earning Now!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
            <h1 style="margin: 0; font-size: 28px;">🎉 Account Approved!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Welcome to PromoHive</p>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333; margin-bottom: 20px;">Congratulations ${fullName}!</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Great news! Your PromoHive account has been approved and you can now start earning money.
            </p>
            
            <div style="background: #d4edda; border: 1px solid #c3e6cb; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h3 style="color: #155724; margin: 0 0 10px 0;">💰 $5 Welcome Bonus Added!</h3>
              <p style="color: #155724; margin: 0; line-height: 1.5;">
                We've credited your account with a $5 welcome bonus. You can now start completing tasks and earning more money!
              </p>
            </div>
            
            <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h3 style="color: #333; margin: 0 0 15px 0;">🚀 What's Next?</h3>
              <ul style="color: #666; line-height: 1.8; margin: 0; padding-left: 20px;">
                <li>Complete tasks to earn money</li>
                <li>Invite friends and earn referral bonuses</li>
                <li>Upgrade your level for higher earnings</li>
                <li>Withdraw your earnings via USDT</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.PLATFORM_URL || 'http://localhost:3000'}/login" 
                 style="background: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Login & Start Earning
              </a>
            </div>
          </div>
          
          <div style="text-align: center; padding: 20px; background: #f8f9fa; color: #666; font-size: 14px;">
            <p style="margin: 0;">© 2024 PromoHive. All rights reserved.</p>
            <p style="margin: 5px 0 0 0;">Global Promo Network</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    logger.info(`Approval email sent to ${email}`);
  } catch (error) {
    logger.error('Failed to send approval email:', error);
    throw error;
  }
};

export const sendMagicLinkEmail = async (email: string, fullName: string, magicLink: string) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@promohive.com',
      to: email,
      subject: 'PromoHive Magic Link - Secure Login',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
            <h1 style="margin: 0; font-size: 28px;">🔐 Secure Login</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">PromoHive Magic Link</p>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333; margin-bottom: 20px;">Hello ${fullName}!</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              You requested a magic link to log in to your PromoHive account. Click the button below to securely log in.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${magicLink}" 
                 style="background: #667eea; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; display: inline-block; font-size: 16px; font-weight: bold;">
                Login to PromoHive
              </a>
            </div>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h3 style="color: #856404; margin: 0 0 10px 0;">⚠️ Important Security Note</h3>
              <p style="color: #856404; margin: 0; line-height: 1.5;">
                This magic link will expire in 10 minutes and can only be used once. If you didn't request this link, please ignore this email.
              </p>
            </div>
            
            <p style="color: #666; line-height: 1.6; font-size: 14px;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              <a href="${magicLink}" style="color: #667eea; word-break: break-all;">${magicLink}</a>
            </p>
          </div>
          
          <div style="text-align: center; padding: 20px; background: #f8f9fa; color: #666; font-size: 14px;">
            <p style="margin: 0;">© 2024 PromoHive. All rights reserved.</p>
            <p style="margin: 5px 0 0 0;">Global Promo Network</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    logger.info(`Magic link email sent to ${email}`);
  } catch (error) {
    logger.error('Failed to send magic link email:', error);
    throw error;
  }
};

// Withdrawal Request Email
export const sendWithdrawalRequestEmail = async (email: string, fullName: string, amount: number) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || 'promohive@globalpromonetwork.store',
      to: email,
      subject: '💰 Withdrawal Request Received - PromoHive',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #00E5FF 0%, #9333EA 50%, #EC4899 100%); color: white;">
            <h1 style="margin: 0; font-size: 28px;">💰 Withdrawal Request</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">PromoHive</p>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333; margin-bottom: 20px;">Hello ${fullName}!</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Your withdrawal request has been received and is under review by our admin team.
            </p>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h3 style="color: #856404; margin: 0 0 10px 0;">⏳ Pending Approval</h3>
              <p style="color: #856404; margin: 0; line-height: 1.5;">
                <strong>Amount:</strong> $${amount.toFixed(2)}<br>
                <strong>Status:</strong> Pending approval<br>
                You will receive a notification email once your withdrawal is approved and processed.
              </p>
            </div>
            
            <p style="color: #666; line-height: 1.6;">
              Our admin team typically processes withdrawals within 24-48 hours. You'll receive another email once your withdrawal has been processed.
            </p>
          </div>
          
          <div style="text-align: center; padding: 20px; background: #f8f9fa; color: #666; font-size: 14px;">
            <p style="margin: 0;">© 2024 PromoHive. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    logger.info(`Withdrawal request email sent to ${email}`);
  } catch (error) {
    logger.error('Failed to send withdrawal request email:', error);
    throw error;
  }
};

// Withdrawal Approved Email
export const sendWithdrawalApprovedEmail = async (email: string, fullName: string, amount: number) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || 'promohive@globalpromonetwork.store',
      to: email,
      subject: '✅ Withdrawal Approved - PromoHive',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white;">
            <h1 style="margin: 0; font-size: 28px;">✅ Withdrawal Approved</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">PromoHive</p>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333; margin-bottom: 20px;">Hello ${fullName}!</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Great news! Your withdrawal request has been approved and processed.
            </p>
            
            <div style="background: #d4edda; border: 1px solid #c3e6cb; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h3 style="color: #155724; margin: 0 0 10px 0;">💰 Payment Details</h3>
              <p style="color: #155724; margin: 0; line-height: 1.5;">
                <strong>Amount Sent:</strong> $${amount.toFixed(2)}<br>
                <strong>Status:</strong> Approved & Processed<br>
                <strong>Payment Method:</strong> USDT
              </p>
            </div>
            
            <p style="color: #666; line-height: 1.6;">
              Your funds should arrive in your wallet within a few minutes. Thank you for using PromoHive!
            </p>
          </div>
          
          <div style="text-align: center; padding: 20px; background: #f8f9fa; color: #666; font-size: 14px;">
            <p style="margin: 0;">© 2024 PromoHive. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    logger.info(`Withdrawal approved email sent to ${email}`);
  } catch (error) {
    logger.error('Failed to send withdrawal approved email:', error);
    throw error;
  }
};

// Withdrawal Rejected Email
export const sendWithdrawalRejectedEmail = async (email: string, fullName: string, amount: number, reason: string) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || 'promohive@globalpromonetwork.store',
      to: email,
      subject: '❌ Withdrawal Rejected - PromoHive',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); color: white;">
            <h1 style="margin: 0; font-size: 28px;">❌ Withdrawal Rejected</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">PromoHive</p>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333; margin-bottom: 20px;">Hello ${fullName}!</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Unfortunately, your withdrawal request has been rejected.
            </p>
            
            <div style="background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h3 style="color: #721c24; margin: 0 0 10px 0;">Rejection Details</h3>
              <p style="color: #721c24; margin: 0 0 10px 0; line-height: 1.5;">
                <strong>Amount Requested:</strong> $${amount.toFixed(2)}<br>
                <strong>Reason:</strong> ${reason}
              </p>
              <p style="color: #721c24; margin: 0; line-height: 1.5;">
                Your funds have been returned to your account balance.
              </p>
            </div>
            
            <p style="color: #666; line-height: 1.6;">
              If you have any questions about this decision, please contact our support team.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.PLATFORM_URL || 'http://localhost:3000'}" 
                 style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Contact Support
              </a>
            </div>
          </div>
          
          <div style="text-align: center; padding: 20px; background: #f8f9fa; color: #666; font-size: 14px;">
            <p style="margin: 0;">© 2024 PromoHive. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    logger.info(`Withdrawal rejected email sent to ${email}`);
  } catch (error) {
    logger.error('Failed to send withdrawal rejected email:', error);
    throw error;
  }
};

// Account Rejected Email
export const sendAccountRejectedEmail = async (email: string, fullName: string, reason: string) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || 'promohive@globalpromonetwork.store',
      to: email,
      subject: '❌ Account Registration Rejected - PromoHive',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); color: white;">
            <h1 style="margin: 0; font-size: 28px;">❌ Registration Rejected</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">PromoHive</p>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333; margin-bottom: 20px;">Hello ${fullName}!</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              We regret to inform you that your account registration has been rejected.
            </p>
            
            <div style="background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h3 style="color: #721c24; margin: 0 0 10px 0;">Rejection Reason</h3>
              <p style="color: #721c24; margin: 0; line-height: 1.5;">
                ${reason}
              </p>
            </div>
            
            <p style="color: #666; line-height: 1.6;">
              If you believe this is an error or have any questions, please contact our support team.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.PLATFORM_URL || 'http://localhost:3000'}" 
                 style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Contact Support
              </a>
            </div>
          </div>
          
          <div style="text-align: center; padding: 20px; background: #f8f9fa; color: #666; font-size: 14px;">
            <p style="margin: 0;">© 2024 PromoHive. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    logger.info(`Account rejected email sent to ${email}`);
  } catch (error) {
    logger.error('Failed to send account rejected email:', error);
    throw error;
  }
};