const express = require('express')
    , router = express.Router()
    , mysql = require('mysql')
    , multer = require('multer')
    , upload = multer({dest: './upload'})
    , bodyParser = require('body-parser')
    , env = require('../env.config.js')
    , cors = require('cors')
    , fs = require('fs')
    , conn = mysql.createConnection(env.info)


router.use(cors())
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

router.get('/customers', (req, res) => {
  conn.query("SELECT * FROM CUSTOMER WHERE isDeleted=0", (err,rows, fields) => {
    if(err){
      console.log(err);
    }
    res.send(rows);
  })
})

router.use('/image',express.static('./upload'));

router.post('/customers',upload.single('image'),(req,res) =>{
  let sql = 'INSERT INTO CUSTOMER VALUES (null,?,?,?,?,?,now(),0)'
    , image = '/api/image/' + req.file.filename
    , name = req.body.name
    , birthday = req.body.birthday
    , gender = req.body.gender
    , job = req.body.job
    , params = [image,name,birthday,gender,job];

    conn.query(sql,params, (err,rows,fields) => {
      if(err){
        console.log(err);
      }
      res.send(rows);
    })
})

router.delete('/customers/:id', (req,res) => {
  let sql = 'UPDATE CUSTOMER SET isDeleted = 1 WHERE id = ?'
    , params = [req.params.id];
    conn.query(sql,params, (err,rows,fields) => {
      if(err){
        console.log(err);
      }else{
        res.send(rows);
      }
    })
})

module.exports = router
