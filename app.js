const express = require('express')
const cors = require('cors')
const bodyparser = require('body-parser')
const userRoutes = require('./routes/user')

const app = express()

app.use(cors())
app.use(bodyparser.json())
app.use('/', userRoutes)


app.listen('3000', () => {
	console.log('server is listening at http://localhost:3000')
})