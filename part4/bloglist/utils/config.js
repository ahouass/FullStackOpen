require('dotenv').config()

const PORT = process.env.PORT || 3003
const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://aiman1337houass_db_user:wadrari@cluster0.ifys3jn.mongodb.net/blogs?appName=Cluster0'

module.exports = { MONGODB_URI, PORT }
