const express = require('express');
const morgan = require('morgan');
const path = require('path')

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

const persons =[
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
];

app.get('/api/persons', (req, res) => {
  res.json(persons);
});

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  const person = persons.find(p => p.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.post('/api/persons', (req, res) => {
  if(re.body.name === undefined || req.body.number === undefined) {
    return res.status(400).json({ error: 'name or number is missing' });
  }
  if(persons.find(p => p.name === req.body.name)) {
    return res.status(400).json({ error: 'name must be unique' });
  }
  const { name, number } = req.body;
  const id = Math.floor(Math.random() * 1000000).toString();
  const newPerson = { id, name, number };
  persons.push(newPerson);
  res.json(newPerson);
});

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  persons = persons.filter(p => p.id !== id);
  res.status(204).end();
});

app.get('/info', (req, res) => {
  const title = `Phonebook has info for ${persons.length} people`;
  res.send(`<p>${title}</p><p>${new Date()}</p>`);
});

app.get('/*splat', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
