const sendgridMail = require('@sendgrid/mail');

const { SENDGRID_KEY } = process.env;

sendgridMail.setApiKey(SENDGRID_KEY);

const sendEmail = async (data) => {
  const email = { ...data, from: 'pavelgonchar13@gmail.com' };
  await sendgridMail.send(email);

  return true;
};

module.exports = sendEmail;
