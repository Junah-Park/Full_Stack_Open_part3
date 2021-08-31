const express = require('express')
const cors = require('cors')
var morgan = require('morgan')

const app = express()

app.use(express.json())
app.use(cors())
app.use(morgan('tiny'))
app.use(express.static('build'))

morgan.token('data', (request) => {
    return JSON.stringify(request.body)
})

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/info', (request, response) => {
    let info = `<p>Phonebook has info for ${persons.length} people</p>`
    info += new Date()
    response.send(info)
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    if (id < persons.length) {
        const person = persons.find(person => person.id === id)
        response.json(person)
    }
    else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const id = Math.random() * 10000

    if (!request.body.name) {
        response.status(400).json({ error: 'Missing name' })
    }
    else if (!request.body.number) {
        response.status(400).json({ error: 'Missing number' })
    }
    else if (persons.some(person => person.name == request.body.name)) {
        response.status(400).json({ error: 'Name must be unique' })
    }

    person = {
        "id": id,
        "name": request.body.name,
        "number": request.body.number
    }

    persons.push(person)

    response.status(204).end()
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

