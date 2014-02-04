//var http = require("http");
var express = require("express");
var mysql = require("mysql2");

var connection = mysql.createConnection({user: 'bd6c78b4c94ff4', password: 'b92672d2', host: 'us-cdbr-east-05.cleardb.net', database: 'heroku_fce19200850a746'});

var app = express();

app.use(express.bodyParser());
app.set('view engine', 'jade');  

app.use(express.static(process.cwd() + '/public'));

/**
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255), 
  comment TEXT NOT NULL, 
  created_at DATETIME NOT NULL, 
  PRIMARY KEY(id))
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
	if(request.query.userComment && request.query.userComment != ''){ //check for page's initial load
		var dateTime = GetDateTime();						
		var row = [indexCounter, request.query.userName, request.query.userComment, dateTime];
		console.log(row);
		indexCounter++;
		//Insert data into the database
		//connection.query('INSERT INTO entries (id, name, comment, created_at) VALUES (' + row[0] + ', ' + row[1] + ', ' + row[2] + ', ' + row[3] + ')')
		//ResultPage to pull the results from the database
		response.render('resultpage');  
	}
	else{
		response.render('application');
	}
    response.end();
});

var port = Number(process.env.PORT || 8888);
app.listen(port);
