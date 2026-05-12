require('dotenv').config()

const express = require('express');
const morgan = require('morgan');
const path = require('path')
const Person = require('./models/person')

const app = express();

app.use(express.json());
app.use(express.static('dist'))

const formatBody = (request) => {
  if (request.method !== 'POST') {
    return '';
  }
  return JSON.stringify(request.body)
    .replace(/:/g, ': ')
    .replace(/,/g, ', ');
};

app.use(morgan((tokens, request, response) => {
  return [
    tokens.method(request, response),
    tokens.url(request, response),
    tokens.status(request, response),
    tokens.res(request, response, 'content-length'),
    '-',
    tokens['response-time'](request, response),
    'ms',
    formatBody(request)
  ].filter(Boolean).join(' ');
}));


app.get('/api/persons', async (req, res, next) => {
  try {
    const persons = await Person.find({})
    res.json(persons)
  } catch (error) {
    next(error)
  }
});

app.get('/api/persons/:id', async (req, res, next) => {
  try {
    const person = await Person.findById(req.params.id)
    if (person) {
      res.json(person)
    } else {
      res.status(404).end()
    }
  } catch (error) {
    next(error)
  }
});

app.post('/api/persons', async (req, res, next) => {
  try {
    if (req.body.name === undefined || req.body.number === undefined) {
      return res.status(400).json({ error: 'name or number is missing' })
    }

    const existing = await Person.findOne({ name: req.body.name })
    if (existing) {
      return res.status(400).json({ error: 'name must be unique' })
    }

    const person = new Person({
      name: req.body.name,
      number: req.body.number,
    })

    const saved = await person.save()
    res.json(saved)
  } catch (error) {
    next(error)
  }
});

app.put('/api/persons/:id', async (req, res, next) => {
  try {
    const updated = await Person.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name, number: req.body.number },
      { new: true }
    )
    res.json(updated)
  } catch (error) {
    next(error)
  }
});

app.delete('/api/persons/:id', async (req, res, next) => {
  try {
    await Person.findByIdAndDelete(req.params.id)
    res.status(204).end()
  } catch (error) {
    next(error)
  }
});

app.get('/info', async (req, res, next) => {
  try {
    const count = await Person.countDocuments({})
    const title = `Phonebook has info for ${count} people`
    res.send(`<p>${title}</p><p>${new Date()}</p>`)
  } catch (error) {
    next(error)
  }
});

app.get('/*splat', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

const errorHandler = (error, req, res, next) => {
  if (error.name === 'CastError') {
    return res.status(400).json({ error: 'malformatted id' })
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
