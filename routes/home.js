const express = require('express')
const router = express.Router()
const Record = require('../models/record')
const moment = require('moment')
const { authenticated } = require('../config/auth')

router.get('/', authenticated, (req, res) => {
  const userName = req.user.name
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

  Record.find({ userId: req.user._id }).exec((err, records) => {
    let totalAmount = 0
    for (let i = 0; i < records.length; i++) {
      totalAmount += Number(records[i].amount)
    }
    if (err) return console.error(err)
    req.flash('success_msg', '發大財，沒有支出')
    return res.render('index', { records, totalAmount, userName, weeklyAmount, lastDayOfWeek, firstDayOfWeek })
  })
})

module.exports = router