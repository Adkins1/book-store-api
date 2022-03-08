const Book = require("../model/Book")

const getAllBooks = async (req, res) => {
  const books = await Book.find()
  if (books) return res.status(204).json({ message: "No books found." })
  res.json(books)
}

const createNewBook = async (req, res) => {
  if (!req?.body?.name)
    return res.status(400).json({ message: "Book name required" })
  if (!req?.body?.desc)
    return res.status(400).json({ message: "Book description required" })
  if (!req?.body?.price)
    return res.status(400).json({ message: "Book price required" })

  try {
    const result = await Book.create({
      name: req.body.name,
      desc: req.body.desc,
      price: req.body.price,
    })

    res.status(201).json(result)
  } catch (err) {
    console.error(err)
  }
}

const updateBook = async (req, res) => {
  if (!req?.body?.id)
    return res.status(400).json({ message: "ID parameter is required" })

  const book = await Book.findOne({ _id: req.body.id }).exec()

  if (!book)
    return res
      .status(204)
      .json({ message: `No book in DB matches ID: ${req.body.id}.` })

  if (req.body?.name) book.name = req.body.name
  if (req.body?.desc) book.desc = req.body.desc
  if (req.body?.price) book.price = req.body.price

  const result = await book.save()
  res.json(result)
}

const deleteBook = async (req, res) => {
  if (!req?.body?.id)
    return res.status(400).json({ message: "Book ID required." })

  const book = await Book.findOne({ _id: req.body.id }).exec()
  if (!book)
    return res
      .status(204)
      .json({ message: `No book in DB matches ID: ${req.body.id}.` })

  const result = await book.deleteOne({ _id: req.body.id })
  res.json(result)
}

const getBook = async (req, res) => {
  if (!req?.params?.id)
    return res.status(400).json({ message: "Book ID required." })

  const book = await Book.findOne({ _id: req.params.id }).exec()
  if (!book)
    return res
      .status(204)
      .json({ message: `No book in DB matches ID: ${req.params.id}.` })
  res.json(book)
}

module.exports = {
  getAllBooks,
  createNewBook,
  updateBook,
  deleteBook,
  getBook,
}
