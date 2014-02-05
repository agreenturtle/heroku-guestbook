//var http = require("http");
var express = require("express");
var mysql = require("mysql2");

var connection = mysql.createConnection({user: 'bd6c78b4c94ff4', 
										 password: 'b92672d2', 
										 host: 'us-cdbr-east-05.cleardb.net', 
										 database: 'heroku_fce19200850a746'});

var app = express();

app.use(express.bodyParser());
app.set('view engine', 'jade');  

app.use(express.static(process.cwd() + '/public'));

//Counter for the ID index
var indexCounter = 1; 

/***************************************************************************/
/**
* This function will get the current date and time and return in the format 
  "Created on: dd/mm/yyyy @ hh:mm:ss"
**/
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

/**
* This function will insert row into the MySQL table entries
* row - Array with the format of [ID#, name, comments, date/time]
**/
function InsertData(guestName,guestComment){
	connection.query('SELECT count(id) AS totalIds FROM entries', function(err,rows){
		console.log(rows);
		if (err){throw err;} //it throws an error
		else{
			var dateTime = GetDateTime();	
			//console.log(rows[0].totalIds);
			var idCount = parseInt(rows[0].totalIds) + 1;
			console.log(idCount);
			var dataRow = [rows[0].totalIds, guestName, guestComment, dateTime];
			console.log(dataRow);
			
			var myString = 'INSERT INTO entries (id, name, comment, created_at) VALUES (\"'
							 + dataRow[0] + '\", \"' 
							 + dataRow[1] + '\", \"'
				 			 + dataRow[2] + '\", \"' 
							 + dataRow[3] + '\")';
			console.log(myString);
			
			connection.query('INSERT INTO entries (id, name, comment, created_at) VALUES (\"'
							 + dataRow[0] + '\", \"' 
							 + dataRow[1] + '\", \"'
				 			 + dataRow[2] + '\", \"' 
							 + dataRow[3] + '\")');
		}	
	});
}

/**
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255), 
  comment TEXT NOT NULL, 
  created_at DATETIME NOT NULL, 
  PRIMARY KEY(id))
**/

/**************************************************************************/

app.get("/", function(request,response){
	if(request.query.userComment && request.query.userComment != ''){ //check for page's initial load
		//Insert data into the database
		var guestName = request.query.userName;
		var guestComment = request.query.userComment;
		InsertData(guestName, guestComment);
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
