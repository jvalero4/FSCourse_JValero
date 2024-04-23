import { useState } from 'react'

const Filter = ({persons, setPersonsFiltered}) => {
    const [filteredName, setFilteredName] = useState('')
  
    const onFilterChange = (event) => {
      const value = event.target.value;
      setFilteredName(value)
      setPersonsFiltered(persons.filter(person => person.name.toLowerCase().includes(value.toLowerCase())))
    }
  
    return(
      <form>
          <div>
            filter shown with <input value= {filteredName} onChange= {onFilterChange} />
          </div>
      </form>
    )
  }

export default Filter
