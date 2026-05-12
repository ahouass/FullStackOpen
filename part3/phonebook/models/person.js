const mongoose = require('mongoose')

const mongoUrl = process.env.MONGODB_URI

if (!mongoUrl) {
  console.error('MONGODB_URI is missing')
  process.exit(1)
}

mongoose.set('strictQuery', false)
mongoose.connect(mongoUrl, { family: 4 })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
}, { collection: 'persons' })

module.exports = mongoose.model('Person', personSchema)
