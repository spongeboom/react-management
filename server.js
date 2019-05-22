const express =require('express')
    , bodyParser =require('body-parser')
    , app = express()
    , port = process.env.PORT || 4000

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));

  app.get('/api/customers', (req, res) => {
    res.send([
      {
      'id':1,
      'image':'https://placeimg.com/64/64/1',
      'name' : '김성윤',
      'birthday' : '960424',
      'gender' :'남자',
      'job':'학생'
      },
      {
      'id':2,
      'image':'https://placeimg.com/64/64/2',
      'name' : '홍길동',
      'birthday' : '960412',
      'gender' :'남자',
      'job':'학생'
      },
      {
      'id':3,
      'image':'https://placeimg.com/64/64/3',
      'name' : '홍길순',
      'birthday' : '960404',
      'gender' :'남자',
      'job':'학생'
      }
    ])
  })

  app.listen(port, () => {
     console.log('server on...')
  })
