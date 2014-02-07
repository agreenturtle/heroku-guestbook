//var http = require("http");
var express = require("express");
var mysql = require("mysql2");

var app = express();

//show will is the toggle variable that will show or hide the guestbook
var show = false;

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

var connection;

function handleDisconnect(){
	connection = mysql.createConnection({user: 'bd6c78b4c94ff4', 
										 password: 'b92672d2', 
										 host: 'us-cdbr-east-05.cleardb.net', 
										 database: 'heroku_fce19200850a746'});
    connection.connect(function(err) {              // The server is either down
      if(err) {                                     // or restarting (takes a while sometimes).
        console.log('error when connecting to db:', err);
        setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
      }                                     // to avoid a hot loop, and to allow our node script to
    });                                     // process asynchronous requests in the meantime.
                                            // If you're also serving http, display a 503 error.
    connection.on('error', function(err) {
      console.log('db error', err);
      if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
        handleDisconnect();                         // lost due to either server restart, or a
      } else {                                      // connnection idle timeout (the wait_timeout
        throw err;                                  // server variable configures this)
      }
	})
}

handleDisconnect();

/*********************** Requests & Response *********************************/

app.get("/", function(req, res){
	show=false;
	res.render('application',{'show':show});
	res.end();
});

/**
* From the start page will first open application.jade->application.html
* When Submit Guest button is clicked it will enter data into the MySQL database, entries
* dataRow - is the row of data that will be entered in to entries in the format:
			[ID, name, comment, date]
**/
app.post("/submit", function(request,response){
	if(request.body.userComment && request.body.userComment != ''){ //should never need this...
		connection.query('SELECT * FROM entries', function(err,rows){
			if (err){throw err;} 
			else{
				var dateTime = GetDateTime();
				var idCount = rows.length + 1;
				var dataRow = [idCount, request.body.userName, request.body.userComment, dateTime];			
			
				connection.query('INSERT INTO entries (id, name, comment, created_at) VALUES (\"'
								 + dataRow[0] + '\", \"' 
								 + dataRow[1] + '\", \"'
					 			 + dataRow[2] + '\", STR_TO_DATE(\"' 
								 + dataRow[3] + '\", \"%m/%d/%Y %H:%i:%s\"))');
			}
			show=false;
			response.render('application',{'show':show});
			response.end();	
		});
	}
	else{
		show=false;
		response.render('application',{'show':show});
		response.end();
	}
});

/**
* This is when the View Guestbook button is clicked (TO DO: Needs to enter comment to work)
* Will render resultpage.jade and will display the table entries
**/
app.get("/ViewGuestbook", function(request,response){
	show = true;
	connection.query('SELECT * FROM entries', function(err,rows){
		response.render('application', {'rows':rows, 'show':show}); 
		response.end();
	});
});

/**
* Goes back to the HomePage (application.html) page
**/
app.get("/sign-in", function(req,res){
	show=false;
	res.render('application',{'show':show});
	res.end();
});

app.get('/hide',function(req,res){
	show=false;
	res.render('application',{'show':show})
});

/**
* Opens deleteguest.jade when Delete is clicked
**/
app.get("/RemoveGuest", function(req,res){
	res.render('deleteguest');
	res.end();
});

/**
* Deletes selected guest from entries
**/
app.post("/DeleteGuest", function(req,res){
	if(req.body.removeName == '' && req.body.removeID == ''){
		show=false;
		res.render('application',{'show':show});
		res.end();
	}
	else{  
		//builds the queryString depending on what was entered in(id & name or id OR name)
		var queryString = 'DELETE FROM entries WHERE ';
		var addAnd = false;
		if(req.body.removeID != ''){
			queryString += 'id = \"' + req.body.removeID + '\"';
			addAnd = true;
		}
		if(req.body.removeName != ''){
			if(addAnd){
				queryString += ' AND ';
			}
			queryString += 'name = \"' + req.body.removeName + '\"';
		}
		connection.query(queryString, function(err,rows){
			if(err){throw err;}
			else{
				connection.query('SELECT * FROM entries', function(err,rows){
					show=true;
					res.render('application', {'rows':rows, 'show':show});
					res.end();
				});
			}
		});
	}
});

/********************************************************************************/

var port = Number(process.env.PORT || 8888);
app.listen(port);
