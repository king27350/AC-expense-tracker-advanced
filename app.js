const express = require('express')
const app = express()
const mongoose = require('mongoose')
const Record = require('./models/record')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const moment = require('moment')


// handlebars-helper 
const handlebars = require("handlebars")

handlebars.registerHelper('formatDate', function (date) {
  const formatDate = moment(date).format("YYYY-MM-DD")
  return formatDate
})

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')


mongoose.connect('mongodb://localhost/record', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })


app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))


const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connected!')
})

//載入 routes
app.use('/', require('./routes/home'))
app.use('/records', require('./routes/record'))


app.listen(3000, () => {
  console.log('app is listening')
})