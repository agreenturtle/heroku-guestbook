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


app.get("/", function(request,response){
	if (request.query.userName !== ''){
		if(request.query.userComment !== ''){
			response.render("ResultPage")
		}
		else{
			response.writeHead(200,{"Content-Type": "text/html"});
			response.write("Hello " + request.query.userName);
			response.write(request.query.userComment);
		}
	}
	
    response.render("application");
    response.end();
});

var port = Number(process.env.PORT || 8888);
app.listen(port);
