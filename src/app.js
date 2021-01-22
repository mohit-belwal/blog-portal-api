const express = require('express')
require('./database/mongoose.js')
const userRouter = require('./routers/user')
const blogRouter = require('./routers/blog')

const app = express()

// To disable site for maintainance uncomment below function
// app.use((req, res, next)=>{
//     res.status(503).send('Site is under maintainance')
// })

app.use(express.json())     
app.use(userRouter)
app.use(blogRouter)

module.exports = app