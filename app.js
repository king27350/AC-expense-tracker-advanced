const express = require('express')
const app = express()
const mongoose = require('mongoose')
const Record = require('./models/record')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const moment = require('moment')
const session = require('express-session')
const passport = require('passport')


// handlebars-helper 
const handlebars = require("handlebars")
handlebars.registerHelper('ifEquals', function (arg1, arg2, options) {
  return (arg1 == arg2) ? options.fn(this) : options.inverse(this)
})

handlebars.registerHelper('formatDate', function (date) {
  const formatDate = moment(date).format("YYYY-MM-DD")
  return formatDate
})

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(session({
  secret: 'records',
  resave: false,
  saveUninitialized: true,
}))
app.use(passport.initialize())
app.use(passport.session())

// 載入 Passport config
require('./config/passport')(passport)
app.use((req, res, next) => {
  res.locals.user = req.user
  next()
})

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
app.use('/users', require('./routes/user'))

app.listen(3000, () => {
  console.log('app is listening')
})