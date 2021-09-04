require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const morgan = require('morgan')

const Person = require('./models/person.js')

const app = express()

app.use(express.json())
app.use(cors())
app.use(morgan('tiny'))
app.use(express.static('build'))

morgan.token('data', (request) => {
    return JSON.stringify(request.body)
})

app.get('/info', (request, response) => {
    let info = `<p>Phonebook has info for ${Person.length} people</p>`
    info += new Date()
    response.send(info)
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    if (!request.body.name) {
        response.status(401).json({ error: 'Missing name' }).end()
    }
    else if (!request.body.number) {
        response.status(402).json({ error: 'Missing number' }).end()
    }

    const person = new Person({
        "id": Math.random() * Number.MAX_SAFE_INTEGER,
        "name": request.body.name,
        "number": request.body.number
    })

    person.save()
        .then(savedPerson => {
            response.status(202).json(savedPerson)
        })
        .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

