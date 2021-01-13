const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const BASE_URL = process.env.PRODUCTION_SERVER || process.env.LOCAL_SERVER;
const EMAIL_SECRET = process.env.EMAIL_SECRET;

const transporter = nodemailer.createTransport({
  host: "smtp-relay.sendinblue.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.TRANSPORT_AUTH_USER,
    pass: process.env.TRANSPORT_AUTH_PASSWORD,
  },
});

// Generate Unique String as activation string
const generateUniqueLink = (username, email) => {
  let config = { username, email };
  return jwt.sign(config, EMAIL_SECRET);
};

// Activation string validator
const verifyUniqueLink = (link) => {
  return jwt.verify(link, EMAIL_SECRET, (error, decoded) => {
    if (error) {
      throw { error: "invalid token" };
    }
    return decoded;
  });
};

// Send mail with unique string
const sendActivationEmail = async (username, email) => {
  let link =
    // Route to API path
    // BASE_URL + "api/user/activation/" + generateUniqueLink(username, email);
    // Route to Client path
    BASE_URL + "activate/" + generateUniqueLink(username, email);
  try {
    let info = await transporter.sendMail({
      from: "BusChecker <noreply@buschecker.com>",
      to: email,
      subject: "Account Activation Email",
      text: `Please access the following link to activate your account \n ${link}`,
      html: `Please access the following link to activate your account \n ${link}`,
    });
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  generateUniqueLink,
  verifyUniqueLink,
  sendActivationEmail,
};
