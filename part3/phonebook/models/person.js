const mongoose = require('mongoose')

const mongoUrl = process.env.MONGODB_URI

if (!mongoUrl) {
  console.error('MONGODB_URI is missing')
  process.exit(1)
}

mongoose.set('strictQuery', false)
mongoose.connect(mongoUrl, { family: 4 })

const phoneValidator = {
  validator: (value) => {
    if (typeof value !== 'string') {
      return false
    }
    if (value.length < 8) {
      return false
    }
    return /^\d{2,3}-\d+$/.test(value)
  },
  message: 'Number must be of form XX-XXXXXXX or XXX-XXXXXXXX'
}

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true,
  },
  number: {
    type: String,
    required: true,
    validate: phoneValidator,
  },
}, { collection: 'persons' })

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)
