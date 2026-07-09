import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendMail = async ({ to, subject, html }) => {

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject,
    html,
  });
};

export const sendVerificationCodeEmail = async (to, code) => {

  await sendMail({
    to,
    subject: 'Tu código de verificación — Busca tu Rommie',
    html: `
      <p>Tu código de verificación es:</p>
      <h2 style="letter-spacing: 4px;">${code}</h2>
      <p>Expira en 15 minutos. Si tú no solicitaste esto, ignora este correo.</p>
    `,
  });
};

export const sendPasswordResetEmail = async (to, code) => {

  await sendMail({
    to,
    subject: 'Recupera tu contraseña — Busca tu Rommie',
    html: `
      <p>Usa este código para restablecer tu contraseña:</p>
      <h2 style="letter-spacing: 4px;">${code}</h2>
      <p>Expira en 15 minutos. Si tú no solicitaste esto, ignora este correo.</p>
    `,
  });
};
