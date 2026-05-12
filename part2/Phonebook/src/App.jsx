import { useEffect, useState } from 'react'
import Filter from './components/Filter'
import Notification from './components/Notification'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons)
    })
  }, [])

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const addPerson = (e) => {
    e.preventDefault()

    const existingPerson = persons.find((person) => person.name === newName)
    const personObject = {
      name: newName,
      number: newNumber
    }

    if (existingPerson) {
      if (!window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        return
      }

      const updatedPerson = { ...existingPerson, number: newNumber }
      personService
        .update(existingPerson.id, updatedPerson)
        .then((returnedPerson) => {
          setPersons((currentPersons) =>
            currentPersons.map((person) =>
              person.id === returnedPerson.id ? returnedPerson : person
            )
          )
          showNotification(`Updated ${returnedPerson.name}`)
          setNewName('')
          setNewNumber('')
        })
        .catch((error) => {
          const message = error.response?.data?.error || 'Failed to update person'
          showNotification(message, 'error')
        })
      return
    }

    personService
      .create(personObject)
      .then((returnedPerson) => {
        setPersons((currentPersons) => currentPersons.concat(returnedPerson))
        showNotification(`Added ${returnedPerson.name}`)
        setNewName('')
        setNewNumber('')
      })
      .catch((error) => {
        const message = error.response?.data?.error || 'Failed to add person'
        showNotification(message, 'error')
      })
  }

  const deletePerson = (id, name) => {
    if (!window.confirm(`Delete ${name}?`)) {
      return
    }

    personService
      .remove(id)
      .then(() => {
        setPersons((currentPersons) => currentPersons.filter((person) => person.id !== id))
        showNotification(`Deleted ${name}`)
      })
      .catch((error) => {
        const message = error.response?.data?.error || `Information of ${name} has already been removed from server`
        showNotification(message, 'error')
        setPersons((currentPersons) => currentPersons.filter((person) => person.id !== id))
      })
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification} />
      <Filter filter={filter} setFilter={setFilter} />
      <h2>add a new</h2>
      <PersonForm
        onSubmit={addPerson}
        newName={newName}
        setNewName={setNewName}
        newNumber={newNumber}
        setNewNumber={setNewNumber}
      />
      <h2>Numbers</h2>
      <Persons persons={persons} filter={filter} onDelete={deletePerson} />
    </div>
  )
}

export default App
