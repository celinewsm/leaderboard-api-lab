var express = require('express')
var bodyParser = require('body-parser')
var cors = require('cors')

var app = express()

// app.use(methodOverride('_method'))
app.set('view engine', 'ejs')

app.use(express.static('static'))

app.use(cors())
app.use(bodyParser.json()) // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true
}))

var entries = [
  {'id': 1,
    'name': 'Akuma',
  'score': 1000},
  { 'id': 2,
    'name': 'Alan Vega',
  'score': 900}
]

app.get('/', function (req, res) {
  res.render('index')
})

app.get('/entries', function (req, res) {
  res.send(entries)
})

app.post('/entries', function (req, res) {
  var entry = {
    id: newID(),
    name: req.body.name,
    score: parseInt(req.body.score, 10)
  }
  entries.push(entry)
  entries.sort(function (a, b) {
    if (a.score > b.score) {
      return -1
    }
    if (a.score < b.score) {
      return +1
    }
    // a must be equal to b
    return 0
  })
  res.json(entries)
// res.render('index')
})

app.get('/entries/:id/edit', function (req, res) {
  console.log('id logged: ' + req.params.id)
  var item = getEntry(parseInt(req.params.id, 10))
  console.log('send back to dom: ' + item)
  res.send(item)
})

app.delete('/entries/:id', function (req, res) {
  entries.splice(req.params.id, 1)
  res.json({message: 'success'})
})

app.put('/entries/:id', function (req, res) {
  console.log('express put function start')
  console.log('params: ', req.body)
  console.log('id: ', req.params.id)
  console.log('name: ', req.body.name)
  console.log('score: ', parseInt(req.body.score, 10))
  var selectedId = getEntry(parseInt(req.params.id, 10))
  selectedId.name = req.body.name
  selectedId.score = parseInt(req.body.score, 10)
  entries[getIndex(parseInt(req.params.id, 10))] = selectedId
  res.send(entries)
})

app.listen(3000, function () {
  console.log('Server is running!')
})

function newID () {
  var highestID = 0
  for (var i = 0; i < entries.length; i++) {
    if (entries[i]['id'] > highestID) {
      highestID = entries[i]['id']
    }
  }
  return highestID + 1
}

function getEntry (id) {
  var entry
  for (var i = 0; i < entries.length; i++) {
    console.log('id: ' + id)
    console.log('entry checking: ' + entries[i].id)
    if (entries[i].id === id) {
      console.log('entry selected: ' + entries[i].id)
      console.log('entry selected content: ' + entries[i])
      entry = entries[i]
    }
  }
  console.log('get entry: ' + entry)
  return entry
}

function getIndex (id) {
  var index
  for (var i = 0; i < entries.length; i++) {
    if (entries[i].id === id) {
      index = i
    }
  }
  return index
}
