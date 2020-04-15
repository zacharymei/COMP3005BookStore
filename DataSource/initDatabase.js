const express = require('express')
const fs = require('fs')
const app = express()
const uniqid = require('uniqid')
const random = require('random')



const cookieParser = require('cookie-parser')
const session = require('express-session')



app.set('views', __dirname + '/public');
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

const { Pool, Client } = require('pg')



const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'Project 3005',
  password: 'student',
  port: 5432,
})
client.connect()



let bookdata = require("./bookdataShort.json")
//console.log(bookdata)



let currentID = 0;

bookdata.forEach((item, i) => {
  //console.log(item)

  let book = {};

  book.id = Number(currentID);
  currentID++;
  book.title = item.title;
  book.isbn10 = item.isbn10;
  book.isbn13 = item.isbn13;
  book.author = item.authors[0];
  book.year = item.year;
  book.page = item.page_count;
  book.tag = item.tags[0];

  if(item.description == ""){
    book.description = "None. "
  }else{
    book.description = item.description.replace(/'/g, "");
  }
  book.publisher = item.publishers[0];



  ////////////////////////////////////     publisher   ////////

  let publisher_id = uniqid();
  let phone_number = random.int(100000,999999) + "" + random.int(100, 999)
  let email = uniqid()+"@hotmail.com"
  if(book.publisher){
    email = book.publisher.replace(/'/g, "").replace(/ /g, "_")+"@gmail.com";
  }
  let bank = random.int(1000000, 9999999)

  let queryPublisher = "insert into publisher values ";
  queryPublisher += "("+"'"+publisher_id+"',"+"'"+book.publisher+"',"+"'"+email+"',"+"'"+phone_number+"',"+"'"+bank+"')"
  //console.log(queryPublisher)

  client.query(queryPublisher, (err, res)=>{
    console.log(err)
  })

  ////////////////////////////////////     publisher   ////////

  book.collection = "none";
  //console.log(typeof random.float())
  book.price = Number(random.float(10,100)).toFixed(2);
  book.percentage = Number(random.float(0,0.5)).toFixed(2);

  let findP = "select * from publisher where name = " + "'" + book.publisher + "'";
  //console.log(findP)
  client.query(findP, (err, pub)=>{
    let pid = null;
    if(err){
      //console.log(err);
    }else if(pub.rows[0]){
      pid = pub.rows[0].publisher_id;
    }


    let query = "insert into book values "
    query += "("
    +book.id+","
    +"'"+book.title+"'"+","
    +"'"+book.isbn10+"'"+","
    +"'"+book.isbn13+"'"+","
    +"'"+book.author+"'"+","
    +book.year+","
    +book.page+","
    +"'"+book.tag+"'"+","
    +"'"+book.description+"'"+","
    +"'"+pid+"'"+","
    +"'"+book.collection+"'"+","
    +book.price+","
    +book.percentage
    +")"

    console.log(query)

    client.query(query, (err, res) => {

      console.log(err, res)


    })



  })





});
