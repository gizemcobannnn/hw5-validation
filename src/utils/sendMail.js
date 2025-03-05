import nodemailer from 'nodemailer';
import { env } from './env.js';
import { SMTP } from '../constants/index.js';

const transporter = nodemailer.createTransport({
  host: env(SMTP.SMTP_HOST),
  port: parseInt(env(SMTP.SMTP_PORT), 10),
  secure: false,
  auth: {
    user: env(SMTP.SMTP_USER),
    pass: env(SMTP.SMTP_PASSWORD),
  },
});
console.log(transporter)
export const sendEmail = async (options) => {
  console.log(options)
  return await transporter.sendMail(options);
};
