
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')


app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

morgan.token('body', (req, res) => {
    if (req.method === 'POST') {
      return JSON.stringify(req.body);
    } else {
      return '-';
    }
  });

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
      response.json(persons)
    }).catch(err => {
      console.error(err);
      response.status(400).json({ error: "Error finding persons" });
    })
    
  })

  app.get('/info', async (request, response, next) => {
    try {
      const count = await Person.countDocuments({});
      const infoPage = `<div>Phonebook has info for ${count} people<br/>${new Date()}</div>`;
      response.send(infoPage);
    } catch (err) {
      next(err)
    }
  });

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id).then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    }).catch(err => next(err))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id).then(result =>{
      response.status(204).end()
    }).catch(err => next(err))
  })

app.post('/api/persons', (request, response, next) => {
    const body = request.body

    if (!body.name || !body.number || (!body.name && !body.number)) {
      return response.status(400).json({ 
        error: 'content missing' 
      })
    }

    Person.findOne({ name: body.name }).then(personReplied => {
      if (personReplied) {
        return response.status(400).json({ 
          error: 'This name is already used' 
        })
      }else{
        const newPerson = new Person ({
          "name": body.name,
          "number": body.number
      })
      newPerson.save().then(savedPerson => {
        response.json(savedPerson)
      }).catch(err => next(err));
      }
    }).catch(err => next(err));

})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findByIdAndUpdate(request.params.id, { name, number }, {new : true, runValidators: true, context: 'query'})
    .then(updatedPerson => response.json(updatedPerson))
    .catch(err => next(err))
})

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
  }

app.use(requestLogger)

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
  
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
   } else if (error.name === 'ValidationError') {
     return response.status(400).send({ error : error.message })
   }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})