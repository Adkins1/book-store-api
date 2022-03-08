const User = require("../model/User")
const cryptoJs = require("crypto-js")
const encMethod = require(process.env.ENCRYPTION_METHOD)
const jwt = require("jsonwebtoken")

const handleLogin = async (req, res) => {
  const { user, pwd } = req.body
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "Username and password are required." })

  const foundUser = await User.findOne({ username: user }).exec()

  if (!foundUser) return res.sendStatus(401) //Unauthorized

  // evaluate password
  const decryptedPassword = await encMethod.decrypt(
    foundUser.password,
    process.env.ENCRYPTION_SECRET
  )
  const originalPassword = decryptedPassword.toString(cryptoJs.enc.Utf8)

  if (originalPassword === pwd) {
    const roles = Object.values(foundUser.roles).filter(Boolean)
    // create JWTs
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.username,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION }
    )
    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION }
    )
    // Saving refreshToken with current user
    foundUser.refreshToken = refreshToken
    const result = await foundUser.save()
    console.log(result)

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    }) //secure: true,
    res.json({ accessToken, roles, user })
  } else {
    res.sendStatus(401)
  }
}

module.exports = { handleLogin }
