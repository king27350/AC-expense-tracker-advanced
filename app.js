const express = require('express')
const app = express()
const mongoose = require('mongoose')
const Record = require('./models/record')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

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

app.get('/', (req, res) => {
  Record.find((err, records) => {
    let totalAmount = 0
    for (let i = 0; i < records.length; i++) {
      totalAmount += Number(records[i].amount)
    }
    if (err) return console.error(err)
    return res.render('index', { records: records, totalAmount })
  })
})
//分類
app.get('/records', (req, res) => {
  const sort = req.query.sort

  if (sort === 'asc' || sort === 'desc') {
    Record.find().sort({ name: sort }).exec((err, records) => {
      res.render('index', { records })
    })
  } else if (sort === '1' || sort === '-1') {
    Record.find().sort({ amount: sort }).exec((err, records) => {
      res.render('index', { records })
    })
  }

})
// 新增一筆 Record 頁面
app.get('/records/new', (req, res) => {
  res.render('new')
})
// 新增一筆  Record 動作
app.post('/records', (req, res) => {
  const record = new Record({
    name: req.body.name,
    date: req.body.date,
    category: req.body.category,
    amount: req.body.amount
  })
  record.save(err => {
    if (err) return console.error(err)
    return res.redirect('/')
  })
})
// 修改 Record 頁面
app.get('/records/:id/edit', (req, res) => {
  Record.findById(req.params.id, (err, record) => {
    console.log(record)
    if (err) return console.log(err)
    return res.render('edit', { record: record })
  })
})
// 修改 Record 動作
app.put('/records/:id', (req, res) => {
  Record.findById(req.params.id, (err, record) => {
    if (err) return console.error(err)
    record.name = req.body.name
    record.amount = req.body.amount
    record.category = req.body.category
    record.date = req.body.date
    record.save(err => {
      if (err) return console.error(err)
      return res.redirect('/')
    })
  })
})
// 刪除 Record
app.delete('/records/:id/delete', (req, res) => {
  Record.findById(req.params.id, (err, record) => {
    if (err) return console.error(err)
    record.remove(err => {
      if (err) return console.error(err)
      return res.redirect('/')
    })
  })
})

app.listen(3000, () => {
  console.log('app is listening')
})