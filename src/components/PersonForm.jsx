import { useState } from 'react'
import personsServices from './../services/persons'

const PersonForm = ({persons, setPersons, setPersonsFiltered, personsFiltered, setMessage}) => {

    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    
  
    const onNameChange = (event) => {
      setNewName(event.target.value)
    }
  
    const onNumberChange = (event) => {
      setNewNumber(event.target.value)
    }
  
    const addPerson = (event) => {
      event.preventDefault()
      const personObject = {
        name: newName,
        number: newNumber
      }
      if(persons.map(person => person.name).includes(newName)) {
        const replacedPerson = persons.filter(person => person.name === newName)
        if(window.confirm(newName + ' is already added to phonebook, replace the old number with a new one?')){
          personsServices.updatePerson(replacedPerson[0].id,personObject).then(response => {
            setPersons(persons.filter(person => person.name !== replacedPerson[0].name).concat(response.data))
            setPersonsFiltered(personsFiltered.filter(person => person.name !== replacedPerson[0].name).concat(response.data))
          }).catch(error => {
            setMessage({text: `Information of ${newName} has already been removed from server`, isError: true})
          })

          setMessage({text: `The number of '${newName}' was modified`, isError: false})
          setTimeout(() => {
            setMessage({text: null, isError: false})
          }, 5000);
        }
        setNewName('')
        setNewNumber('')
      }else{
        personsServices.createPerson(personObject).then(response => {
          setPersons(persons.concat(response.data))
          setPersonsFiltered(personsFiltered.concat(response.data))
          setNewName('')
          setNewNumber('')
          setMessage({text: `Added '${newName}'`, isError: false})
        }).catch(error => {
          setMessage({text: error.response.data.error, isError: true})
        })
        
        setTimeout(() => {
          setMessage({text: null, isError: false})
        }, 5000);
        
      }
      
    }
  
    return(
      <form onSubmit={addPerson}>
          <div>
            name: <input value={newName} onChange = {onNameChange} />
          </div>
          <div>
            number: <input value={newNumber} onChange = {onNumberChange} />
          </div>
          <div>
            <button type="submit">add</button>
          </div>
        </form>
    )
  }

export default PersonForm