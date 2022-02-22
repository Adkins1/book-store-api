const User = require("../model/User")

const getAllUsers = async (req, res) => {
  const users = await User.find()
  !users && res.status(204).json({ message: "No users found" })
  res.json(users)
}

const deleteUser = async (req, res) => {
  !req?.body?.id && res.status(400).json({ message: "User ID required" })
  const user = await User.findOne({ _id: req.body.id }).exec()
  !user && res.status(204).json({ message: `User ID ${req.body.id} not found` })
  const result = await user.deleteOne({ _id: req.body.id })
  res.json(result)
}

const getUser = async (req, res) => {
  !req?.params?.id && res.status(400).json({ message: "User ID required" })
  const user = await User.findOne({ _id: req.params.id }).exec()
  !user &&
    res.status(204).json({ message: `User ID ${req.params.id} not found` })
  res.json(user)
}

module.exports = {
  getAllUsers,
  deleteUser,
  getUser,
}
