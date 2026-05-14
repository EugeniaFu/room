export const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {

    // roles que vienen del JWT
    const userRoles = req.user.roles;

    // verificar si tiene alguno permitido
    const hasRole = allowedRoles.some(role =>
      userRoles.includes(role)
    );

    if (!hasRole) {
      return res.status(403).json({
        error: 'No autorizado'
      });
    }

    next();
  };
};