const express =require('express')
    , bodyParser =require('body-parser')
    , app = express()
    , port = process.env.PORT || 4000
    , fs = require('fs')
    , mysql = require('mysql')
    , env = require('./env.config.js')
    , path = require('path')
    , conn = mysql.createConnection(env.info)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

conn.connect((err) => {
  if(err){
    console.log("SQL CONNECT ERROR: " + err);
  }else{
    console.log("SQL CONNECT SUCCESSFUL");
  }
});

app.use('/',express.static(path.join(__dirname, './client/management/build')))

auth = require('./route/auth.js')
app.use('/auth', auth)

userInfo = require('./route/userInfo.js')
app.use('/api', userInfo)

app.get('/*',(req,res) => {
  res.sendFile(path.join(__dirname,'/client/management/build','index.html'))
})


app.listen(port, () => {
     console.log('server on...' + port + ' port')
  })
