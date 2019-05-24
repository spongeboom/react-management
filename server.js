const express =require('express')
    , bodyParser =require('body-parser')
    , app = express()
    , port = process.env.PORT || 4000
    , fs = require('fs')
    , mysql = require('mysql')
    , data = fs.readFileSync('./database.json')
    , conf = JSON.parse(data)
    , multer = require('multer')
    , upload = multer({dest: './upload'})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

      conn = mysql.createConnection({
        host:conf.host,
        user:conf.user,
        password:conf.password,
        port:conf.port,
        database:conf.database
      })
  conn.connect();

  app.get('/api/customers', (req, res) => {
    conn.query("SELECT * FROM CUSTOMER WHERE isDeleted=0", (err,rows, fields) => {
      if(err) throw console.log(err);
      res.send(rows);
    })
  })


  app.post('/api/test', (req,res) => {
    console.log(req.body.birthday);
    res.send(req.body.test);
  })

  app.use('/image',express.static('./upload'));
  app.post('/api/customers',upload.single('image'),(req,res) =>{
    let sql = 'INSERT INTO CUSTOMER VALUES (null,?,?,?,?,?,now(),0)'
      , image = '/image/' + req.file.filename
      , name = req.body.name
      , birthday = req.body.birthday
      , gender = req.body.gender
      , job = req.body.job
      , params = [image,name,birthday,gender,job];

      conn.query(sql,params, (err,rows,fields) => {
        if(err) throw err
        res.send(rows);
      })
  })

  app.delete('/api/customers/:id', (req,res) => {
    let sql = 'UPDATE CUSTOMER SET isDeleted = 1 WHERE id = ?'
      , params = [req.params.id];
      conn.query(sql,params, (err,rows,fields) => {
        res.send(rows);
      })
  })

  app.listen(port, () => {
     console.log('server on...')
  })
