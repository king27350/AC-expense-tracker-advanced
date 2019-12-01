const mongoose = require('mongoose')
const Record = require('../record')
const records = require('../../data/records').results

mongoose.connect('mongodb://localhost/record', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('db error')
})

db.once('open', () => {
  console.log('connected')
  for (i = 0; i < records.length; i++) {
    Record.create({
      name: `${records[i].name}`,
      category: `${records[i].category}`,
      amount: `${records[i].amount}`,
      date: `${records[i].date}`
    })
  }
  console.log('done')

})