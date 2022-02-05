const db = require('../config/connection')
const md5 = require('md5')
const jwt = require('jsonwebtoken')

module.exports.register = async (req, res, next) => {
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
              console.log('user registration successful')
              let token = jwt.sign({ data: result }, 'secret')
              res.send({ status: 1, data: result, token : token });
            }
          })
        } else {
            console.log('username occupied...')
            res.send({status: 0, message: 'username occupied'})
        }
      });
    } catch (error) {
        console.log(error)
        res.send({ status: 0, error: error });
    }
}


module.exports.login = async (req, res, next) => {
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
}

module.exports.viewProfile = async (req, res, next) => {
    try{
        const id = req.params.id;
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
    } catch {

    }
}


module.exports.editProfile = async (req, res, next) => {
  console.log('registering new user', req.body)
    try {
      const id = req.params.id;
      const { username, email, password } = req.body; 
      const hashed_password = md5(password.toString())
      console.log('updating user...', id, req.body)

      const checkUsername = `Select username FROM users WHERE username = ?`;
      db.query(checkUsername, [username], (err, result, fields) => {
        if(!result.length){
          console.log('hello')
        const sql = `update users set username='${username}', email='${email}', password='${hashed_password}' where id = ${id}`;
        db.query(
            sql, [username, email, hashed_password],
          (err, result, fields) =>{
            console.log(result)
            if(err){
              console.log(err)
              res.send({ status: 0, data: err });
            }else{
              console.log('user update successful...')
              let token = jwt.sign({ data: result }, 'secret')
              res.send({ status: 1, data: result, token : token });
            }
          })
        } else {
            console.log('username occupied...')
            res.send({status: 0, message: 'username occupied'})
        }
      });
    } catch (error) {
        console.log(error)
        res.send({ status: 0, error: error });
    }
}


module.exports.deleteProfile = async (req, res, next) => {
    try{
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
    } catch {

    }
}


module.exports.uploadImage = async (req, res) => {
    try {
        const id = req.params.id;
        const imgName =`http://localhost:3000/` + req.file.filename;
        console.log(res.file);
        console.log(imgName);
        const sql = `UPDATE users SET img = '${imgName}' WHERE id = ${req.params.id}`;
        db.query(sql, (err, rows, fields)=>{
            if(!err){
                res.send(rows[0]);
            }else{
                console.log(err);
            }
        })
    } catch (error) {
        console.error(error.message);
        return res.status(500).send("Server error.");
        }
    };
  