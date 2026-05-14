import jwt from 'jsonwebtoken';
import * as authService from './auth.service.js';

export const register = async (req, res) => {

  try {

    const {
      name,
      email,
      phone,
      password,
      roles
    } = req.body;

    const user = await authService.register({
      name,
      email,
      phone,
      password,
      roles
    });

    const {
      password: _,
      ...safeUser
    } = user;

    res.json(safeUser);

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

    const token = jwt.sign(
      {
        userId: user.id,
        roles: user.roles.map(r => r.role.name)
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password: _, ...safeUser } = user;

    res.json({
      token,
      user: safeUser
    });

  } catch (err) {
    res.status(400).json({
      error: err.message
    });
  }
};