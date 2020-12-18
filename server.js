var MongoClient = require('mongodb').MongoClient
var express     = require('express')
var app         = express();
var bodyParser  = require('body-parser');
var http 				= require('http')
var methodOverride = require ('method-override');
var cors = require('cors')

var urlBanco = 'mongodb://localhost:27017';
var MeuBanco;

MongoClient.connect(urlBanco, {useUnifiedTopology: true, useNewUrlParser: true}, function(err, db) {

  if (err)
  {
    console.log('Erro acessando o Banco');
  }
  MeuBanco = db.db("App");

});


app.use(cors()); //normal CORS
app.options("*", cors()); //preflight
app.use(methodOverride('X-HTTP-Method'));
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(methodOverride('X-Method-Override'));
app.use(methodOverride('_method'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});


app.post('/enviaQRCODE', function (req, resp) {
  var IdItem    = req.body.IdItem;
  var UserCPF = req.body.CPF;

  var queryItem = { _id: IdItem}
  var queryUser = { _id: UserCPF}

  var InfoItem
  var NovoPreço
  var Desc

  MeuBanco.collection('Itens').find(queryItem).limit(1).toArray(function(err,result){

    
    if(result[0]==undefined){
      
      resp.send({tipo: 'Erro', msg: 'Item não encontrado'})
      resp.end()
      
    }
    else{
      
      InfoItem = {
        
        Preço: result[0].Preço,
        Nome: result[0].Nome,
        
      }
      
      MeuBanco.collection('Users').find(queryUser).limit(1).toArray(function(err,SecondResult){

        NovoPreço = InfoItem.Preço - (SecondResult[0].Reputation*InfoItem.Preço)
        Desc = SecondResult[0].Reputation * 100
      
        resp.send({tipo: 'RespostaCodigo', InfoItem: InfoItem, NovoPreço: NovoPreço, Desconto: Desc});
        resp.end();
  
      })

    }

  })

});

app.post('/entrar', function (req, resp) {
  let User    = req.body.user;
  let Password  = req.body.pass;

  let query = { _id: User}

  MeuBanco.collection('Users').find(query).limit(1).toArray(function (err, result) {

    if (result[0]==undefined){
      console.log('Usuario não encontrado')
      resp.send({tipo: 'Erro', msg: 'Usuario incorreto'})
      resp.end()
    }
    else
    {

      if(result[0].Senha == Password){

        console.log('Logado')
        resp.send({tipo: 'SucessoLogin', msg: 'Logado com sucesso!'})
        resp.end()

      }
      else{

        console.log('Senha incorreta')
        resp.send({tipo: 'Erro', msg: 'Senha incorreta'})
        resp.end()

      }
      
    }

  })

  console.log('Recebeu login: '+User+' Senha: '+Password);
});

app.post('/confirmaRegistro', function (req, resp) {
  let Nome    = req.body.Nome;
  let Password  = req.body.Senha;
  let CPFUser = req.body.CPF;
  let Email = req.body.EMail;

  let query = { _id: CPFUser}

  MeuBanco.collection('Users').find(query).limit(1).toArray(function (err, result){

    if(result[0] == undefined){

      let NewUser = {_id: CPFUser, Nome: Nome, Senha: Password, Email: Email, Admin: false, Reputation: 0.0}

      MeuBanco.collection('Users').insertOne(NewUser, function(err,res){

        if (err)
        {
          console.log("erro inserindo elemento")
        }
        else {
          console.log('1 document inserted')
        }

      })

      resp.send({tipo: 'SucessoRegistro',msg: 'Conta registrada'})
      resp.end()

    }
    else{

      console.log('Usuario ja existente (CPF)!')
      resp.send({tipo: 'Erro',msg: 'CPF ja existente'})
      resp.end()

    }

  })

});

app.listen(8080, function() {
  console.log("servidor no ar");
});
