import { useEffect, useState } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons)
    })
  }, [])

  const addPerson = (e) => {
    e.preventDefault()

    const existingPerson = persons.find((person) => person.name === newName)
    const personObject = {
      name: newName,
      number: newNumber
    }

    if (existingPerson) {
      const wantsUpdate = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      )

      if (!wantsUpdate) {
        return
      }

      const changedPerson = { ...existingPerson, number: newNumber }

      personService.update(existingPerson.id, changedPerson).then((returnedPerson) => {
        setPersons((currentPersons) =>
          currentPersons.map((person) =>
            person.id === existingPerson.id ? returnedPerson : person
          )
        )
        setNewName('')
        setNewNumber('')
      })
      return
    }

    personService.create(personObject).then((returnedPerson) => {
      setPersons((currentPersons) => currentPersons.concat(returnedPerson))
      setNewName('')
      setNewNumber('')
    })
  }

  const deletePerson = (id, name) => {
    if (!window.confirm(`Delete ${name}?`)) {
      return
    }

    personService.remove(id).then(() => {
      setPersons((currentPersons) => currentPersons.filter((person) => person.id !== id))
    })
  }

  return (
    <div>
      <h2>Phonebook</h2>
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
