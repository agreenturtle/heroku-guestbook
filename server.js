//var http = require("http");
var express = require("express");
var mysql = require("mysql2");

var connection = mysql.createConnection({user: 'bd6c78b4c94ff4', password: 'b92672d2', host: 'us-cdbr-east-05.cleardb.net', database: 'heroku_fce19200850a746'});

var app = express();

app.use(express.bodyParser());
app.set('view engine', 'jade');  

app.use(express.static(process.cwd() + '/public'));

/**
* Input sample data into table (table name is entries) - table was created in seeds.js (ran only one time and doesn't need to be ran again.)
CREATE TABLE entries(
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255), 
  comment TEXT NOT NULL, 
  created_at DATETIME NOT NULL, 
  PRIMARY KEY(id))
**/

//connection.query('INSERT INFO entries (id, name, comment, created_at) VALUES (1, "John Doe")')

/**
* loads application html - calls application.jade which calls application.html
**/

//Counter for the ID index
var indexCounter = 1; 

function GetDateTime(){
	var currentdate = new Date(); 
	var datetime = "Created on: " + currentdate.getDate() + "/"
	                + (currentdate.getMonth()+1)  + "/" 
	                + currentdate.getFullYear() + " @ "  
	                + currentdate.getHours() + ":"  
	                + currentdate.getMinutes() + ":" 
	                + currentdate.getSeconds();
	return datetime;
}


app.get("/", function(request,response){
	if(request.query.userComment && request.query.userComment != ''){ //First time on page will load application
		var dateTime = GetDateTime();						
		var row = [indexCounter, request.query.userName, request.query.userComment, dateTime];
		console.log(row);
		indexCounter++;
		response.render('ResultPage');  
	}
	else{
		response.render('application');
	}
    response.end();
});

var port = Number(process.env.PORT || 8888);
app.listen(port);
