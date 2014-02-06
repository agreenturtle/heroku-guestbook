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

/*********************** Helper Functions *************************************/
/**
* This function will get the current date and time and return in the format 
  dd/mm/yyyy hh:mm:ss"
**/
function GetDateTime(){
	var currentdate = new Date(); 
	var datetime = (currentdate.getMonth()+1) + "/"
	                + currentdate.getDate()  + "/" 
	                + currentdate.getFullYear() + " "  
	                + currentdate.getHours() + ":"  
	                + currentdate.getMinutes() + ":"
	                + currentdate.getSeconds();
	
	return datetime;
}

/*********************** Requests & Response *********************************/

/**
* From the start page will first open application.jade->application.html
* When Submit Guest button is clicked it will enter data into the MySQL database, entries
* dataRow - is the row of data that will be entered in to entries in the format:
			[ID, name, comment, date]
**/
app.get("/", function(request,response){
	if(request.query.userComment && request.query.userComment != ''){ //check for page's initial load
		connection.query('SELECT count(id) AS totalIds FROM entries', function(err,rows){

			if (err){throw err;} 
			else{
				var dateTime = GetDateTime();	
				var idCount = parseInt(rows[0].totalIds) + 1;
				var dataRow = [rows[0].totalIds, request.query.userName, request.query.userComment, dateTime];			
			
				connection.query('INSERT INTO entries (id, name, comment, created_at) VALUES (\"'
								 + dataRow[0] + '\", \"' 
								 + dataRow[1] + '\", \"'
					 			 + dataRow[2] + '\", STR_TO_DATE(\"' 
								 + dataRow[3] + '\", \"%m/%d/%Y %H:%i:%s\"))');
			}
			response.render('application');
			response.end();	
		});
	}
	else{
		response.render('application');
		response.end();
	}
});

/**
* This is when the View Guestbook button is clicked (TO DO: Needs to enter comment to work)
* Will render resultpage.jade and will display the table entries
**/
app.post("/ViewGuestbook", function(request,response){
	connection.query('SELECT * FROM entries', function(err,rows){
		response.render('resultpage', {'rows':rows}); 
		response.end();
	});
});

/**
* Goes back to the HomePage (application.html) page
**/
app.post("/home", function(request,response){
	response.render('application');
	response.end();
});

app.post("/Delete", function(request,reponse){
	response.render('deleteguest');
	response.end();
});

/**
* Deletes selected guest from entries
**/
app.post("/DeleteGuest", function(request,response){
	if(request.query.userName == '' && request.query.userID = ''){
		response.render('application');
		response.end();
	}
	else{
		connection.query('DELETE FROM entries WHERE id = ' + request.query.userID + 'AND name = ' + request.query.userName, function(err,rows){
			if(err){throw err;}
			else{
				response.render('resultpage', {'rows':rows});
				response.end();
			}
		});
	}
});

/********************************************************************************/

var port = Number(process.env.PORT || 8888);
app.listen(port);
