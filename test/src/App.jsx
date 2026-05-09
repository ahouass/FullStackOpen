import { useEffect, useState } from 'react'
import axios from 'axios'
// import './App.css'

function App() {
  const [notes, setNotes] = useState([])

  useEffect(() => {
    axios.get('/api/notes').then(response => {
      setNotes(response.data)
    })
  }, [])

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note => (
          <li key={note.id}>{note.content}</li>
        ))}
      </ul>
    </div>
  )
}

export default App
