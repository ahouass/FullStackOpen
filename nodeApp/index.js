const express = require('express')
const app = express()

// ---- Middleware 1: JSON Parser (built-in) ----
app.use(express.json())

// ---- Middleware 2: Custom Logger ----
const requestLogger = (request, response, next) => {
  console.log('--- Request Received ---')
  console.log('Method:', request.method)
  console.log('Path:', request.path)
  console.log('Time:', new Date().toLocaleTimeString())
  console.log('---')
  next()
}
app.use(requestLogger)

// ---- Middleware 3: Fake Authentication ----
const fakeAuth = (request, response, next) => {
  const password = request.headers['password']
  if (password === 'secret123') {
    console.log('✅ Authenticated')
    next()  // Allowed
  } else {
    console.log('❌ Wrong password')
    response.status(401).json({ error: 'Wrong password! Hint: secret123' })
    // Note: NO next() here — request stops
  }
}

// ---- Data ----
let notes = [
  { id: 1, content: 'HTML is easy', important: true },
  { id: 2, content: 'CSS is fun', important: false },
]

// ---- Public Route (no auth) ----
app.get('/', (request, response) => {
  response.send('<h1>Welcome to Notes API</h1><p>Use /api/notes to see notes</p>')
})

// ---- Protected Routes (with auth) ----
app.get('/api/notes', fakeAuth, (request, response) => {
  response.json(notes)
})

app.post('/api/notes', fakeAuth, (request, response) => {
  const note = {
    id: notes.length + 1,
    content: request.body.content,
    important: request.body.important || false,
  }
  notes = notes.concat(note)
  response.json(note)
})

// ---- Middleware 4: 404 Catch-All (always last) ----
const unknownEndpoint = (request, response) => {
  response.status(404).json({ error: 'Endpoint not found' })
}
app.use(unknownEndpoint)

// ---- Start Server ----
const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})