const PORT = process.env.PORT || 3000
const express = require('express')

const app = express()
const morgan = require('morgan')
const mongoose = require('mongoose')
require('dotenv/config')

const CONNECT_URL = process.env.CONNECT_URL
const api = process.env.API_URL

mongoose.connect(CONNECT_URL,()=>{
    console.log('connected to database')
}).catch(err=>{
    console.log(err)
})

require('./models/posts')
require('./models/users')

app.use(express.json())
app.use(morgan('tiny'))

const AuthRouter = require('./routes/auth')
const PostRouter = require('./routes/post')
const UserRouter = require('./routes/user')

app.use(`${api}`,AuthRouter)
app.use(`${api}`,PostRouter)
app.use(`${api}`,UserRouter)


app.listen(PORT,()=>{
    console.log("App is running on http://localhost:3000")
})

app.get('*',(req, res) =>{
    res.status(404).json({Error:'Page not found'})
})

