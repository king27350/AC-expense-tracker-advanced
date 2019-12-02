const mongoose = require('mongoose')
const Record = require('../record')
const records = require('../../data/records').results
const User = require('../user')
const users = require('../../data/users').results
const bcrypt = require('bcryptjs')

mongoose.connect('mongodb://localhost/record', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('db error')
})

db.once('open', () => {
  console.log('connected')

  //create users
  for (let j = 0; j < 2; j++) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(users[j].password, salt, (err, hash) => {
        const newUser = new User({
          name: users[j].name,
          email: users[j].email,
          password: hash
        })
        newUser.save().then(user => {
          //create records
          for (i = 0; i < records.length; i++) {
            Record.create({
              name: `${records[i].name}`,
              category: `${records[i].category}`,
              amount: `${records[i].amount}`,
              date: `${records[i].date}`,
              userId: `${user._id}`
            })
          }
        })
      })
    })
  }

  console.log('done')

})