require('dotenv').config();

const express = require('express')
const cors = require('cors')
const bodyparser = require('body-parser')
const userRoutes = require('./routes/users')
const connection = require('./config/connection')

const app = express()

app.use(express.static(__dirname + '/uploads'));

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cors())
app.use(bodyparser.json())
app.use('/', userRoutes)


app.listen('3000', () => {
	console.log('server is listening at http://localhost:3000')
})