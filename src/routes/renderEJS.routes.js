const express = require('express');
const path = require('path');

const router = express.Router();

const PLATFORM_MAILS = {
    SUPPORT: "support@experta.io",
    SERVICE: "service@experta.io",
};

const PLATFORM_SOCIALS = {
    FACEBOOK: "https://www.facebook.com/profile.php?id=61572857308146",
    TWITTER: "https://twitter.com/experta",
    LINKEDIN: "https://www.linkedin.com/company/experta",
    INSTAGRAM: "https://www.instagram.com/experta.io",
    YOUTUBE: "https://www.youtube.com/experta.io",
};

const DOMAIN = {
    PLATFORM_WEB: process.env.PLATFORM_WEB_DOMAIN,
    PLATFORM_BRAND: "experta.io",
    CLOUDSTORAGE_DOMAIN: "https://expertabackend.s3.ap-south-1.amazonaws.com"
};

router.get('/otp-emailer', (req, res) => {
    const otp = '890989';
    const PLATFORM_NAME = "Ekansh ka app";

    res.render(path.join(__dirname, '../templates/emails/otp-emailer.ejs'), {
        otp,
        PLATFORM_NAME,
        PLATFORM_MAILS,
        PLATFORM_SOCIALS,
        DOMAIN
    });
});

module.exports = router;