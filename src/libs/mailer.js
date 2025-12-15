import nodemailer from "nodemailer";

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  SMTP_FROM,
} = process.env;

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;

  const port = Number(SMTP_PORT || 587);
  const secure = port === 465; 

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure,
    auth: SMTP_USER && SMTP_PASS ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 20000,
  });

  return transporter;
};

export const sendEmail = async ({ to, subject, html }) => {
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.warn("SMTP no configurado, no se enviará correo");
    return { skipped: true };
  }

  const mailOptions = {
    from: SMTP_FROM || `Citas Médicas <${SMTP_USER}>`,
    to,
    subject,
    html,
  };

  const t = getTransporter();
  const info = await t.sendMail(mailOptions);
  return info;
};
