const mongoose = require('mongoose')

if (process.argv.length<3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://jvalero4:${password}@clusterfs.6iigeyh.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
  })

const Person = mongoose.model('Person', personSchema)

if (process.argv.length===3) {

    Person.find({}).then(result => {
        console.log('phonebook:');
        result.forEach(person => {
          console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
      })    
}else if (process.argv.length===5) {

    const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
    })

    person.save().then(result => {
        console.log(`added ${result.name} number ${result.number} to phonebook`)
        mongoose.connection.close()
    })
} else {
    console.log('Give password as an argument if you want to see database info or password, name and number of a person you want to add to phonebook')
    process.exit(1)
}

