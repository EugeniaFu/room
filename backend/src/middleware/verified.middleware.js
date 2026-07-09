import prisma from '../config/prisma.js';

export const verifiedMiddleware = async (req, res, next) => {

  try {

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { verificationStatus: true },
    });

    if (!user) {

      return res.status(401).json({
        error: 'Usuario no encontrado',
      });
    }

    if (user.verificationStatus !== 'APPROVED') {

      return res.status(403).json({
        error:
          'Debes completar y esperar la verificación de tu cuenta (INE, comprobante de domicilio y foto) antes de publicar',
        verificationStatus: user.verificationStatus,
      });
    }

    next();

  } catch (err) {

    res.status(500).json({
      error: 'Error validando la verificación de la cuenta',
    });
  }
};
