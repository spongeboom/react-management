const express = require('express')
    , router = express.Router()
    , mysql = require('mysql')
    , Multer = require('multer')
    // , upload = Multer({dest: 'upload/'})
    , bodyParser = require('body-parser')
    , env = require('../env.config.js')
    , cors = require('cors')
    , fs = require('fs')
    , {format} = require('util')
    , conn = mysql.createConnection(env.info)
    , {Storage} = require('@google-cloud/storage')

const storage = new Storage();
const bucket = storage.bucket('magements_user_image')

router.use(cors())
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

const multer = Multer({
  storage: Multer.MemoryStorage,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
})

router.post('/test', multer.single('file'),(req,res,next) => {
  if(!req.file){
    res.status(400).send('No file uploaded');
    return;
  }

  const blob = bucket.file(Date.now() + req.file.originalname);
  const blobStream = blob.createWriteStream({
    resumable: false,
  });

  blobStream.on('error', err => {
      next(err);
  })

  blobStream.on('finish', () => {
    const publicUrl = format(
      `https://storage.googleapis.com/${bucket.name}/${blob.name}`
    );
    res.status(200).send(publicUrl)
  });

  blobStream.end(req.file.buffer)
})

router.get('/customers', (req, res) => {
  conn.query("SELECT * FROM CUSTOMER WHERE isDeleted=0", (err,rows, fields) => {
    if(err){
      console.log(err);
    }
    res.send(rows);
  })
})


router.post('/customers',multer.single('file'),(req,res,next) =>{
  if(!req.file){
      console.log('No file Uploaded');
      return;
  }

  const blob = bucket.file(Date.now() + req.file.originalname);
  const blobStream = blob.createWriteStream({
    resumable: false,
  });

  blobStream.on('error', err => {
    next(err);
  })

// 파일이 업로드 된 후 데이터베이스에 등록
  blobStream.on('finish', () => {
    let sql = 'INSERT INTO CUSTOMER VALUES (null,?,?,?,?,?,now(),0)'
    const publicUrl = format(
    `https://storage.googleapis.com/${bucket.name}/${blob.name}`
    );

    let name = req.body.name
      , birthday = req.body.birthday
      , gender = req.body.gender
      , job = req.body.job
      , params = [publicUrl,name,birthday,gender,job];

        conn.query(sql,params, (err,rows,fields) => {
          if(err){
            console.log(err);
          }
          res.send(rows);
        })
  })
  blobStream.end(req.file.buffer)
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
