const express =require('express')
    , bodyParser =require('body-parser')
    , app = express()
    , port = process.env.PORT || 4000

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));

  app.get('/api/hello', (req,res)=>{
    res.send({message:'hello express'})
  })

  app.listen(port, () => {
     console.log('server on...')
  })
