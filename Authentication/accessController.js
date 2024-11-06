function validateRole(allowedRoles) {
  return (req, res, next) => {
    const user = req.user;

    if (user && !allowedRoles.includes(user.role)) {
      return res.status(403).json({
        message: "You have no acceess to perform this task",
      });
    }
    if (user && allowedRoles.includes(user.role)) {
      next();
    }
  };
}

exports.validateRole = validateRole;
