const mongoose = require("mongoose")
const Schema = mongoose.Schema

const bookSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      default: "Book name",
    },
    desc: {
      type: String,
      required: true,
      default: "Book description",
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model("Book", bookSchema)
