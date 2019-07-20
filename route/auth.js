const express = require('express')
    , router = express.Router()
    , mysql = require('mysql')
    , fs = require('fs')
    , env = require('../env.config.js')
    , session = require('express-session')
    , bodyParser = require('body-parser')
    , sha512 = require('js-sha512')
    , conn = mysql.createConnection(env.info)

router.use(session(env.session));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:false}));

const LoginUser = (id,pw,callback) => {
  let sql = 'SELECT * FROM MEMBER WHERE id="' + id +'"';
  console.log(id,pw,'22');
  conn.query(sql,(err,rows) => {
    if(rows.length === 0){
      callback(0)
    }else {
      if(pw === rows[0].password){
        callback(1)
      }else {
        callback(-1)
      }
    }
  })
}

router.post('/login', (req,res) => {
  let id =req.body.id
    , pw =req.body.pw

    console.log(req.body);
    LoginUser(id,pw,(result) => {
      if(result === 1){
        req.session.login =result
        req.session.userid = id
        res.json({authed:req.session.login, userid: req.session.userid})
      }else {
        req.session.login = result
        res.json({authed:req.session.login})
      }
    });
})

router.get('/logined', (req,res) => {
  if(req.session.login === 1){
    res.json({isLogined:true})
  }else{
    res.json({isLogined:false})
  }
})


module.exports = router
