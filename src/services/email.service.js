// Updated src/services/email.service.js
const fs = require('fs');
const path = require('path');
const transporter = require('../config/email.config');

class EmailService {
  async sendEmail(to, subject, templateName, cc = [], bcc = []) {
    try {
      console.log("templeteName",templateName);
      const templatePath = path.join(__dirname, `../templates/${templateName}.html`);
      if(!fs.existsSync(templatePath)) {
        throw new Error('Template not found');
      }
      const template = fs.readFileSync(templatePath, 'utf8');

      const mailOptions = {
        from: process.env.SMTP_USER,
        to,
        subject,
        html: template,
        cc: cc.length > 0 ? cc : undefined,
        bcc: bcc.length > 0 ? bcc : undefined
      };

      const info = await transporter.sendMail(mailOptions);
      return {
        success: true,
        messageId: info.messageId,
        recipients: {
          to,
          cc: cc.length > 0 ? cc : [],
          bcc: bcc.length > 0 ? bcc : []
        }
      };
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
  }
}

module.exports = new EmailService();