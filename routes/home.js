const express = require('express')
const router = express.Router()
const Record = require('../models/record')

router.get('/', (req, res) => {
  Record.find((err, records) => {
    let totalAmount = 0
    for (let i = 0; i < records.length; i++) {
      totalAmount += Number(records[i].amount)
    }
    if (err) return console.error(err)
    return res.render('index', { records: records, totalAmount })
  })
})

module.exports = router