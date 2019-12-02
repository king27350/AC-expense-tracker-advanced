const express = require('express')
const router = express.Router()
const Record = require('../models/record')
const { authenticated } = require('../config/auth')


//分類
router.get('/', authenticated, (req, res) => {
  const month = req.query.month
  const sort = req.query.sort
  let totalAmount = 0
  if (sort === 'asc' || sort === 'desc') {
    Record.find({ userId: req.user._id }).sort({ name: sort }).exec((err, records) => {

      for (let i = 0; i < records.length; i++) {
        totalAmount += Number(records[i].amount)
      }
      res.render('index', { records, totalAmount })
    })
  } else if (sort === '1' || sort === '-1') {
    Record.find({ userId: req.user._id }).sort({ amount: sort }).exec((err, records) => {

      for (let i = 0; i < records.length; i++) {
        totalAmount += Number(records[i].amount)
      }
      res.render('index', { records, totalAmount })
    })
  } else if (Number(month) === 1) {
    Record.find({ userId: req.user._id }).exec((err, record) => {
      let records = record.filter(item => item.date.getMonth() <= 2)
      for (let i = 0; i < records.length; i++) {
        totalAmount += Number(records[i].amount)
      }
      res.render('index', { records, totalAmount })
    })
  } else if (Number(month) === 2) {
    Record.find({ userId: req.user._id }).exec((err, record) => {
      let records = record.filter(item => item.date.getMonth() <= 5 && item.date.getMonth() > 2)
      for (let i = 0; i < records.length; i++) {
        totalAmount += Number(records[i].amount)
      }
      res.render('index', { records, totalAmount })
    })
  } else if (Number(month) === 3) {
    Record.find({ userId: req.user._id }).exec((err, record) => {
      let records = record.filter(item => item.date.getMonth() <= 8 && item.date.getMonth() > 5)
      for (let i = 0; i < records.length; i++) {
        totalAmount += Number(records[i].amount)
      }
      res.render('index', { records, totalAmount })
    })
  } else if (Number(month) === 4) {
    Record.find({ userId: req.user._id }).exec((err, record) => {
      let records = record.filter(item => item.date.getMonth() <= 11 && item.date.getMonth() > 8)
      for (let i = 0; i < records.length; i++) {
        totalAmount += Number(records[i].amount)
      }
      res.render('index', { records, totalAmount })
    })
  }

})
// 新增一筆 Record 頁面
router.get('/new', authenticated, (req, res) => {
  res.render('new')
})
// 新增一筆  Record 動作
router.post('/', authenticated, (req, res) => {
  const record = new Record({
    name: req.body.name,
    date: req.body.date,
    category: req.body.category,
    amount: req.body.amount,
    userId: req.user._id
  })
  record.save(err => {
    if (err) return console.error(err)
    return res.redirect('/')
  })
})
// 修改 Record 頁面
router.get('/:id/edit', authenticated, (req, res) => {
  Record.findOne({ _id: req.params.id, userId: req.user._id }, (err, record) => {
    return res.render('edit', { record: record })
  })
})
// 修改 Record 動作
router.put('/:id', authenticated, (req, res) => {
  Record.findOne({ _id: req.params.id, userId: req.user._id }, (err, record) => {
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
router.delete('/:id/delete', authenticated, (req, res) => {
  Record.findOne({ _id: req.params.id, userId: req.user._id }, (err, record) => {
    if (err) return console.error(err)
    record.remove(err => {
      if (err) return console.error(err)
      return res.redirect('/')
    })
  })
})

module.exports = router