const EmailService = require('../services/email.service');

class EmailController {
  async sendEmail(req, res) {
    try {
      const { 
        to, 
        subject, 
        templateName, 
        templateVariables = {}, 
        cc = [], 
        bcc = [] 
      } = req.body;

      const result = await EmailService.sendEmail(
        to, 
        subject, 
        templateName, 
        templateVariables, 
        cc, 
        bcc
      );
      
      res.status(200).json({
        success: true,
        message: 'Email sent successfully',
        data: result
      });
    } catch (error) {
      console.error('Controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to send email',
        error: error.message
      });
    }
  }
}

module.exports = new EmailController();