import jwt from 'jsonwebtoken';
import * as authService from './auth.service.js';

const buildSession = (user) => {

  const token = jwt.sign(
    {
      userId: user.id,
      roles: user.roles.map(r => r.role.name)
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  const { password: _password, ...safeUser } = user;

  return { token, user: safeUser };
};

export const register = async (req, res) => {

  try {

    const {
      name,
      email,
      phone,
      password
    } = req.body;

    const user = await authService.register({
      name,
      email,
      phone,
      password
    });

    res.json({
      message:
        'Cuenta creada. Revisa tu correo para confirmar tu cuenta.',
      email: user.email,
    });

  } catch (err) {

    res.status(400).json({
      error: err.message
    });

  }
};

export const verifyEmail = async (req, res) => {

  try {

    const { email, code } = req.body;

    const user = await authService.verifyEmail(email, code);

    res.json(buildSession(user));

  } catch (err) {

    res.status(400).json({
      error: err.message
    });
  }
};

export const resendVerificationCode = async (req, res) => {

  try {

    await authService.resendVerificationCode(req.body.email);

    res.json({
      message: 'Código reenviado, revisa tu correo.',
    });

  } catch (err) {

    res.status(400).json({
      error: err.message
    });
  }
};

export const forgotPassword = async (req, res) => {

  try {

    await authService.forgotPassword(req.body.email);

    res.json({
      message:
        'Si el correo existe, te enviamos un código para recuperar tu contraseña.',
    });

  } catch (err) {

    res.status(400).json({
      error: err.message
    });
  }
};

export const resetPassword = async (req, res) => {

  try {

    const { email, code, newPassword } = req.body;

    await authService.resetPassword(email, code, newPassword);

    res.json({
      message: 'Contraseña actualizada, ya puedes iniciar sesión.',
    });

  } catch (err) {

    res.status(400).json({
      error: err.message
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await authService.login(email, password);

    res.json(buildSession(user));

  } catch (err) {
    res.status(400).json({
      error: err.message
    });
  }
};
