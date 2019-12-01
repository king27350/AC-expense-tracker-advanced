const express = require('express')
const app = express()
const mongoose = require('mongoose')
const Record = require('./models/record')
const exphbs = require('express-handlebars')

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')


mongoose.connect('mongodb://localhost/record', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connected!')
})

app.get('/', (req, res) => {
  Record.find((err, records) => {
    if (err) return console.error(err)
    return res.render('index', { records: records })
  })
})
// 列出全部 Record
app.get('/records', (req, res) => {
  res.send('列出所有 Record')
})
// 新增一筆 Record 頁面
app.get('/records/new', (req, res) => {
  res.send('新增 Record 頁面')
})
// 新增一筆  Record 動作
app.post('/records', (req, res) => {
  res.send('建立 Record')
})
// 修改 Record 頁面
app.get('/records/:id/edit', (req, res) => {
  res.send('修改 Record 頁面')
})
// 修改 Record 動作
app.post('/records/:id/edit', (req, res) => {
  res.send('修改 Record')
})
// 刪除 Record
app.post('/records/:id/delete', (req, res) => {
  res.send('刪除 Record')
})

app.listen(3000, () => {
  console.log('app is listening')
})