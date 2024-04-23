
import personsServices from './../services/persons'

const Person = (props) => {

  const Button = (props) => {
    return(
    <button onClick={props.handleClick}> 
      {props.text}
    </button>
    )
  }

  const handleDeletePerson = (person) => {
    if(window.confirm('Delete ' + person.name +'?')) {
      personsServices.deletePerson(person.id).then(response => {
        props.setPersons(props.persons.filter(person => response.data.id !== person.id))
        props.setPersonsFiltered(props.personsFiltered.filter(person => response.data.id !== person.id))
        }).catch(error => {
          props.setMessage({text: `Information of ${person.name} has already been removed from server`, isError: true})
          setTimeout(() => {
            props.setMessage({text: null, isError: false})
          }, 5000);
        })
    }
    
  }

  return(
    <ul>
      {props.personsFiltered.map((person) => <li key={person.name}>
      {person.name} {person.number} 
      <Button  handleClick ={() => handleDeletePerson(person)} text ="Delete"/>
      </li>
      )}
    </ul>
    
  )
}

export default Person
