const express = require('express')
const fs = require('fs')
const random = require('random')
const app = express()

const mongo = require('mongo')
const client = require('mongodb').MongoClient
const ObjectID = require('mongodb').ObjectID;

const cookieParser = require('cookie-parser')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session);

const store = new MongoDBStore({
  uri: 'mongodb://localhost:27017/a4',
  collection: 'sessions'
});

const { Pool, Client } = require('pg')
const pgclient = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'Project 3005',
  password: 'student',
  port: 5432,
})
pgclient.connect();



app.set('view engine', 'ejs')
app.set('views', __dirname + '/public');
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(session({ secret: 'sakura', store: store }))
app.use(cookieParser())


const port = 3000;

let db;

client.connect("mongodb://localhost:27017/", (err, client)=>{
  if (err) throw err;
  console.log("Connected to database.")
  db = client.db('a4');

  /// Initialize users collection

  db.createCollection("users", (err, result)=>{
    if(err) throw err;
    console.log("Created collection: users. ")
  })

  /// Initialize users collection

  db.createCollection("orders", (err, result)=>{
    if(err) throw err;
    console.log("Created collection: orders. ")
  })

  /// Initialize books collection

  db.createCollection("book", (err, result)=>{
    if(err) throw err;
    console.log("Created collection: book. ")
  })



  const server = app.listen(port, ()=>{console.log("Server listening on port " + port + ".. ");})

})

app.get('/', (req, res)=>{
  res.render('./pages/home.ejs', {"data": {"session":req.session}})
})



app.get('/user/:id', (req, res)=>{


  let query = "select * from "+JSON.stringify("user");
  query += " where user_id = "+req.params.id;
  //console.log(query)
  pgclient.query(query, (err, result)=>{
    //console.log(result.rows)
    if(err) res.end("Invalid user. ")

    let queryOrders = "select * from "+JSON.stringify("order")+" where user_id = "+req.params.id;
    pgclient.query(queryOrders, (err, resultOrders)=>{
      res.render('./pages/profile.ejs', {"data": {
        "profile": result.rows[0],
        "orders": resultOrders.rows,
        "session":req.session}})
      })

    })






})

app.get('/orderform', (req, res)=>{

  if(req.session.loggedin){
    res.render('./pages/orderform.ejs', {"data": {"session":req.session}})
  }
  else{
    res.send("You should login first. ")
  }


})



app.get('/order/:orderid', (req, res)=>{

  let queryOrder = "select * from "+JSON.stringify("order")+" where order_id = "+req.params.orderid
  console.log(queryOrder)
  pgclient.query(queryOrder, (err, resultOrder)=>{
    //console.log(err)

    let queryUser = "select * from "+JSON.stringify("user")+" where user_id = "+resultOrder.rows[0].user_id;
    pgclient.query(queryUser, (err, resultUser)=>{
      console.log(err)
      let queryBooks = "select * from "+JSON.stringify("order_book")+" natural join book "+" where order_id = "+req.params.orderid;
      pgclient.query(queryBooks, (err, resultBooks)=>{
        console.log(err)


        res.render('./pages/order.ejs', {"data": {
                "order": resultOrder.rows[0],
                "user": resultUser.rows[0],
                "books": resultBooks.rows,
                "session": req.session
              }})

      })

    })

  })

})


app.get('/book/:bookid', (req, res)=>{



  let query = "select * from book where book_id = "+"'"+req.params.bookid+"'";
  pgclient.query(query, (err, result)=>{
    res.render('./pages/book.ejs', {"data": {
            "book": result.rows[0],
            "session": req.session
          }})
  })



})

app.get('/library', (req, res)=>{

  //console.log(req.query)

  let query = "select * from book";
  if(Object.keys(req.query).length > 0){
    query += " where ";
    Object.keys(req.query).forEach((search, i) => {

      if(i != 0 ){
        query += " and ";
      }

      if(parseInt(req.query[search])){
        query += search + " = " + "'" +req.query[search] + "'";

      }else{
        query += search + " like " + "'%" + req.query[search] + "%'";
      }
    });

  }

  console.log(query)

  pgclient.query(query, (err, result)=>{
    if(err) res.redirect("/library")
    else
    res.render('./pages/library.ejs', {"data": {
      "books": result.rows,
      "session": req.session
    }})
  })



})



app.post('/submit', (req, res)=>{

  let objOrder = req.body;
  console.log(req.body)




  let user_id = req.session.userid;
  let total = Number(req.body.total).toFixed(2);
  let tracking_number = random.int(1000000, 9999999);
  let query = "insert into "+ JSON.stringify("order") +" values "
  query += "("+"default"+","+user_id+","+total+",'"+tracking_number+"')"
  query += " returning order_id"
  console.log(query)
  pgclient.query(query, (err, result)=>{
    if(err) console.log(err);
    //console.log(result);

    req.body.order.forEach((item, i) => {
      let book_id = item.id;
      let quantity = item.quantity;


      let queryOrderBook = "insert into order_book values ";
      queryOrderBook += "(" + result.rows[0].order_id + ",'"+book_id+"',"+quantity+")"
      console.log(queryOrderBook)

      pgclient.query(queryOrderBook, (err, resultOrder)=>{
        console.log(err)
      })

    });


    res.status(200)
    res.redirect("/order/"+result.rows[0].order_id)
  })



})

app.get('/add', (req, res)=>{

})


app.post('/register', (req, res, next)=>{


  let query = "insert into "+ JSON.stringify("user") +" values ";
  let username = "'"+req.body.username+"'";
  let password = "'"+req.body.password+"'";
  let first_name = "'"+req.body.first_name+"'";
  let last_name = "'"+req.body.last_name+"'";
  let phone_number = "'"+req.body.phone_number+"'";
  query += "(default," + username+","+password+","+first_name+","+last_name+","+phone_number+")"

  console.log(query)

  pgclient.query(query, (err, result) => {
    //if(err) throw err;
    console.log(err)
  })

  login(req, res, next);



})

app.post('/login', (req, res, next)=>{
  login(req, res, next);
})

app.post('/logout', (req, res, next)=>{
  logout(req, res, next)
})

/// Privacy change

app.post('/privacy', (req, res)=>{

  db.collection("users").findOneAndUpdate({"username": req.session.username}, {'$set':{'privacy': JSON.parse(req.body.privacy)}});
  req.session.privacy = JSON.parse(req.body.privacy);
  res.redirect("/users")

})

////////////////////   Files   //////////////////////////

app.get('/css/:file', (req, res)=>{
  res.sendFile(__dirname + '/public/css/'+req.params.file)
})

app.get('/scripts/:file', (req, res)=>{
  res.sendFile(__dirname + '/public/scripts/'+ req.params.file)
})

app.get('/images/:image', (req, res)=>{
  res.sendFile(__dirname + '/public/images/'+req.params.image)
})



///////////////////   Functions   ////////////////////


function login(req, res, next){
	if(req.session.loggedin){
		res.status(200).send("Already logged in.");
		return;
	}


  let query = "select * from "+JSON.stringify("user");
  pgclient.query(query, (err, result)=>{
    //console.log(result.rows)
    let username = req.body.username;
  	let password = req.body.password;

    let valid = 0;

    result.rows.forEach((item, i) => {
      if(item.username === username){
        if(item.password === password){
          req.session.loggedin = true;
  				req.session.username = username;
          req.session.userid = item.user_id;
          valid = 1;
          return;
        }
      }
    });

    if(valid === 0){
      res.status(401).send("Not authorized. Invalid login.");
    }else{
      res.redirect("/user/"+req.session.userid)
    }


  })





}

function logout(req, res, next){
	if(req.session.loggedin){
		req.session.loggedin = false;
    res.redirect('/')
    console.log(req.session.username + " Logged out. ")
	}else{
		res.status(200).send("You cannot log out because you aren't logged in.");
	}
}
