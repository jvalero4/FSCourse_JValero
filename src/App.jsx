import { useState,useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Person from './components/Person'
import personsServices from './services/persons.mjs'
import Notification from './components/Notification'
import './index.css'

const App = () => {
  const [persons, setPersons] = useState([])
  const [personsFiltered, setPersonsFiltered] = useState([])
  const [message, setMessage] = useState({text: null, isError: null})
  useEffect(() => {
    personsServices.getAllPersons().then(response => {
      setPersons(response.data)
      setPersonsFiltered(response.data)
    })
  }, [])

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message = {message}/>
      <Filter persons = {persons} setPersonsFiltered = {setPersonsFiltered}/>
      <h2>add a new</h2>
      <PersonForm persons = {persons} setPersons= {setPersons} setPersonsFiltered = {setPersonsFiltered} personsFiltered = {personsFiltered} setMessage = {setMessage}/>
      <h2>Numbers</h2>
      <Person persons = {persons} setPersons= {setPersons} setPersonsFiltered = {setPersonsFiltered} personsFiltered = {personsFiltered} setMessage = {setMessage}/>
    </div>
  )
}

export default App
