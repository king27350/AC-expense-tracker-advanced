const express = require('express')
const router = express.Router()
const Record = require('../models/record')

const { authenticated } = require('../config/auth')

router.get('/', authenticated, (req, res) => {
  const userName = req.user.name
  Record.find({ userId: req.user._id }).exec((err, records) => {
    let totalAmount = 0
    for (let i = 0; i < records.length; i++) {
      totalAmount += Number(records[i].amount)
    }
    if (err) return console.error(err)
    req.flash('success_msg', '發大財，沒有支出')
    return res.render('index', { records, totalAmount, userName })
  })
})

module.exports = router