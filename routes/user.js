const express = require('express')
const mysql = require('mysql')
var md5 = require('md5');
var jwt = require('jsonwebtoken');
const app = express()
const router = express.Router()

const db = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "strong@1234",
	database: "login_page_test"
});

db.connect((err) => {
	if(err){
		console.log("Database not connected..." + err);
	} else {
		console.log("Database connected...");
	}
});

router.get('/', (req, res) => {
    res.send('Hello there!')
})

router.get('/users', (req, res) => {
    console.log('view all users...')
    const sql = `select * from users`;
    db.query(sql, (err, result) => {
        if(err){
            console.log('error occured...', err)
        } else {
            res.send({
                message: 'all users...',
                data: result
            })
        }
    })
})

router.get('/profile/:id', (req, res) => {
    const sql = `select * from users where id = ${id}`;
    db.query(sql, (err, result) => {
        if(err){
            console.log('error occured...', err)
        } else {
            if(result.length > 0){
                res.send({
                    message: 'user profile...',
                    data: result
                })
            } else {
                res.send({
                    message: 'no user found...'
                })
            }
        }
    })
})


router.put('/user/:id', (req, res) => {
    const id = req.params.id;
    const { username, email, password } = req.body;
    console.log('updating user...', id, req.body)
    const sql = `update users set username='${username}', email='${email}', password='${password}' where id = ${id}`;
    db.query(sql, (err, result) => {
        if(err){
            console.log('error occured...', err)
        } else {
            res.send({
                message: 'updated user profile ...',
                data: result
            })
        }
    })
})

router.delete('/user/:id', (req, res) => {
    const id = req.params.id;
    const sql = `delete from users where id = ${id}`;
    db.query(sql, (err, result) => {
        if(err){
            console.log('error occured...', err)
        } else {
            console.log('user deleted...', result)
            res.send({
                message: 'deleted user profile ...',
                data: result
            })
        }
    })
})


router.post('/register', async function (req, res, next) {
    console.log('registering new user', req.body)
    try {
      const { username, email, password } = req.body; 
     
      const hashed_password = md5(password.toString())
  
      const checkUsername = `Select username FROM users WHERE username = ?`;
      db.query(checkUsername, [username], (err, result, fields) => {
        if(!result.length){
          console.log('hello')
          const sql = `Insert Into users (username, email, password) VALUES ( ?, ?, ? )`
          db.query(
            sql, [username, email, hashed_password],
          (err, result, fields) =>{
            console.log(result)
            if(err){
              console.log(err)
              res.send({ status: 0, data: err });
            }else{
              let token = jwt.sign({ data: result }, 'secret')
              res.send({ status: 1, data: result, token : token });
            }
          })
        }
      });
    } catch (error) {
      res.send({ status: 0, error: error });
    }
  });
  
  router.post('/login', async function (req, res, next) {
    try {
      const { username, password } = req.body; 
     
      const hashed_password = md5(password.toString())
      const sql = `SELECT * FROM users WHERE username = ? AND password = ?`
      db.query(
        sql, [username, hashed_password],
      function(err, result, fields){
        if(err){
          res.send({ status: 0, data: err });
        }else{
          console.log(result)
          if(!result.length){
            res.send({status:0, data: result})
          } else{
            let token = jwt.sign({ data: result }, 'secret')
            res.send({ status: 1, data: result, token: token });
          }
        }
       
      })
    } catch (error) {
      res.send({ status: 0, error: error });
    }
  });
  














module.exports = router