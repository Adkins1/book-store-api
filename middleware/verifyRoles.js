const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    !req?.roles && res.sendStatus(401)
    const rolesArray = [...allowedRoles]
    const result = req.roles
      .map((role) => rolesArray.includes(role))
      .find((val) => val === true)
    !result && res.sendStatus(401)
    next()
  }
}

module.exports = verifyRoles
