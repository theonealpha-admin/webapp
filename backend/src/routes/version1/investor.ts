import express from 'express';
import nodemailer from 'nodemailer';
import { z } from 'zod';

const router = express.Router();

// Define validation schema for investor data
const investorDataSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format"),
  email: z.string().email("Invalid email format"),
  mobileNumber: z.string().regex(/^(\+91|0)?[6-9]\d{9}$/, "Invalid mobile number"),
  address: z.string().min(1, "Address is required"),
  alignmentConfirm: z.boolean(),
  readyToProceed: z.boolean(),
  acknowledgeTimelines: z.boolean()
});

// Route for submitting seed partner data
router.post('/submit', function(req, res) {
  (async () => {
    try {
      // Validate request body
      const validatedData = investorDataSchema.parse(req.body);
      
      // Configure email transporter
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
      });

      // Format the admin email content
      const adminEmailContent = `
        <h2>New Seed Partner Application</h2>
        <p><strong>Applicant Details:</strong></p>
        <ul>
          <li><strong>Full Name:</strong> ${validatedData.fullName}</li>
          <li><strong>PAN Number:</strong> ${validatedData.panNumber}</li>
          <li><strong>Email:</strong> ${validatedData.email}</li>
          <li><strong>Mobile Number:</strong> ${validatedData.mobileNumber}</li>
          <li><strong>Address:</strong> ${validatedData.address}</li>
        </ul>
        
        <p><strong>Confirmation Status:</strong></p>
        <ul>
          <li>Structure and Terms Review: ${validatedData.alignmentConfirm ? 'Confirmed' : 'Not Confirmed'}</li>
          <li>Ready to Proceed: ${validatedData.readyToProceed ? 'Yes' : 'No'}</li>
          <li>Timeline Acknowledgment: ${validatedData.acknowledgeTimelines ? 'Acknowledged' : 'Not Acknowledged'}</li>
        </ul>
        
        <p><strong>Next Steps:</strong></p>
        <ol>
          <li>Review applicant details</li>
          <li>Contact applicant within 48 hours</li>
          <li>Send formal documentation if approved</li>
          <li>Confirm capital deployment schedule (March 25, 2025)</li>
        </ol>
        <hr>
        <p><em>This is an automated notification from TheOneAlpha Seed Partner Onboarding System</em></p>
      `;

      // Format the user email content
      const userEmailContent = `
        <h2>Subject: Your Seed Pool Activation – Next Steps & Timeline</h2>
        
        <p>Dear ${validatedData.fullName},</p>

        <p>We are pleased to confirm that you have successfully completed the Seed Partner Onboarding Protocol for <strong>Genesis Series – Pool #001</strong>. Your participation initiates a structured onboarding process, ensuring a smooth transition from formalization to capital deployment.</p>

        <h3>Next Steps & Timeline</h3>
        <ol>
          <li><strong>Compliance Review</strong> – Your KYC and verification process will be completed by <strong>Monday, March 17, 2025</strong>. This step ensures regulatory compliance before proceeding with formal agreements.</li>
          
          <li><strong>Seed Pool Finalization</strong> – Formal agreements will be finalized by <strong>Wednesday, March 19, 2025</strong>. This involves signing and structuring commitments required to secure the necessary capital base.</li>
          
          <li><strong>Prime Lender Approval</strong> – Institutional funding approval will be secured by <strong>Thursday, March 20, 2025</strong>. Once the seed pool is formalized, the approval process for institutional funding is initiated, paving the way for capital extension.</li>
          
          <li><strong>Terminal Setup</strong> – Systems and infrastructure will be prepared by <strong>Friday, March 21, 2025</strong>. This includes operational readiness, execution mechanisms, and access provisioning.</li>
          
          <li><strong>Capital Deployment</strong> – By <strong>Friday, March 21, 2025</strong>, once the prime lender approval is secured, the seed fund procurement process will be completed. This enables the activation and extension of capital by the prime lender, ensuring liquidity for strategy execution.</li>
          
          <li><strong>Operations Begin</strong> – Execution officially starts on <strong>Tuesday, March 25, 2025</strong>. With capital in place and systems fully operational, the strategy transitions into live deployment. Upon capital deployment, you will receive a secure login credential to access your dedicated dashboard. This portal will provide quarterly tracking of performance and strategic execution updates, ensuring you stay up to date throughout the investment cycle.</li>
        </ol>

        <p>We will provide timely updates at each stage and assist you throughout the process. If you have any questions, feel free to contact us at enquiries@theonealpha.com.</p>

        <p>Welcome aboard. We look forward to this journey together.</p>
        
        <p><strong>Best regards</strong>,<br>
        <strong>The One Alpha</strong><br>
        www.theonealpha.com</p>
        
        <hr>
        <p style="font-size: 12px; color: #666;">
          This communication is confidential and intended solely for the addressee. The information contained herein is subject to the terms and conditions outlined in our partnership agreement.
        </p>
      `;

      // Admin notification email
      const adminMailOptions = {
        from: `"${process.env.EMAIL_DISPLAY_NAME}" <${process.env.EMAIL_FROM}>`,
        to: process.env.ADMIN_EMAIL,
        subject: `New Seed Partner Application - ${validatedData.fullName}`,
        html: adminEmailContent
      };

      // User confirmation email
      const userMailOptions = {
        from: `"${process.env.EMAIL_DISPLAY_NAME}" <${process.env.EMAIL_FROM}>`,
        to: validatedData.email,
        subject: 'TheOneAlpha - Seed Partner Application Received',
        html: userEmailContent
      };

      try {
        // Send both emails
        await Promise.all([
          transporter.sendMail(adminMailOptions),
          transporter.sendMail(userMailOptions)
        ]);

        // Return success response
        return res.status(200).json({
          success: true,
          message: 'Application submitted successfully. You will receive a confirmation email shortly.'
        });
      } catch (emailError) {
        console.error('Error sending emails:', emailError);
        return res.status(500).json({
          success: false,
          message: 'Application received but there was an error sending confirmation emails. Our team will contact you.'
        });
      }
    } catch (error) {
      console.error('Error processing seed partner application:', error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: error.errors
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'Failed to process your application. Please try again later.'
      });
    }
  })();
});

export default router;