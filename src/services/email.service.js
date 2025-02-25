const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const transporter = require('../config/email.config');

class EmailService {
  async sendEmail(to, subject, templateName, templateVariables = {}, cc = [], bcc = []) {
    try {
      console.log("templateName", templateName);
      const templatePath = path.join(__dirname, `../templates/${templateName}.ejs`);
      if (!fs.existsSync(templatePath)) {
        throw new Error('Template not found');
      }
      const template = fs.readFileSync(templatePath, 'utf8');
      const html = ejs.render(template, templateVariables);

      const mailOptions = {
        from: process.env.SMTP_USER,
        to,
        subject,
        html,
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