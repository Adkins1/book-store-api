const User = require("../model/User")
const encMethod = require(process.env.ENCRYPTION_METHOD)

const handleNewUser = async (req, res) => {
  const { user, pwd } = req.body
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "Username and password are required." })

  // check for duplicate usernames in the db
  const duplicate = await User.findOne({ username: user }).exec()
  duplicate && res.sendStatus(409) //Conflict

  try {
    //encrypt the password
    const hashedPwd = await encMethod
      .encrypt(pwd, process.env.ENCRYPTION_SECRET)
      .toString()

    //create and store the new user
    const result = await User.create({
      username: user,
      password: hashedPwd,
    })

    console.log(result)

    res.status(201).json({ success: `New user ${user} created!` })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { handleNewUser }