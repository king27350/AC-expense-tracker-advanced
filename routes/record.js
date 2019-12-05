const express = require('express')
const router = express.Router()
const Record = require('../models/record')
const { authenticated } = require('../config/auth')
const moment = require('moment')


//分類
router.get('/filter', authenticated, (req, res) => {
  const month = req.query.month
  const category = req.query.category
  let totalAmount = 0

  // 判斷今天日期，選出當周的日期範圍
  today = moment().format('YYYY-MM-DD')
  d = moment(today).format('d')
  lastDayOfWeek = moment().add(6 - d, 'days').format('YYYY-MM-DD')
  firstDayOfWeek = moment().add(-d, 'days').format('YYYY-MM-DD')
  // 找尋這周所登記的支出
  let weeklyAmount = 0
  Record.find({ userId: req.user._id, date: { "$lte": moment(lastDayOfWeek).toISOString(), "$gte": moment(firstDayOfWeek).toISOString() } }).exec((err, recordsOfWeek) => {
    for (let j = 0; j < recordsOfWeek.length; j++) {
      weeklyAmount += Number(recordsOfWeek[j].amount)
    }
  })

  Record.find({ userId: req.user._id }).exec((err, record) => {
    let records = ''
    if (!category) {
      records = record.filter(item => item.date.getMonth() === (Number(month) - 1))
    } else if (!month) {
      records = record.filter(item => item.category === category)
    } else {
      records = record.filter(item => item.date.getMonth() === (Number(month) - 1)).filter(item2 => item2.category === category)
    }

    for (let i = 0; i < records.length; i++) {
      totalAmount += Number(records[i].amount)
    }
    req.flash('success_msg', '發大財，沒有支出')
    res.render('index', { records, totalAmount, month, category, weeklyAmount, lastDayOfWeek, firstDayOfWeek })
  })

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
    store: req.body.store,
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
    record.store = req.body.store
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