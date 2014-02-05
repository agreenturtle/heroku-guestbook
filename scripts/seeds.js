var mysql = require("mysql2");
var connection = mysql.createConnection({user: 'bd6c78b4c94ff4', password: 'b92672d2', host: 'us-cdbr-east-05.cleardb.net', database: 'heroku_fce19200850a746'});

/*
connection.query('SELECT count(*) AS tableCount FROM information_schema.tables WHERE table_schema = "entries" AND table_name = "heroku_fce19200850a746";', function(err,rows){
	if (err){
		console.log('error :', err);
	} 
	else if (rows[0].tableCount == 0){
		//console.log('here');
 
	}
	else{
		console.log('Table Exists');
	}
	console.log(rows);
});
*/

connection.query('CREATE TABLE entries(id INT NOT NULL AUTO_INCREMENT,
									   name VARCHAR(255), 
									   comment TEXT NOT NULL, 
									   created_at DATETIME NOT NULL, 
									   PRIMARY KEY(id));', function(err2,rows2){
	console.log('in query');
	if(err2){
		console.log('error: ', err2);
	}
	else{
		console.log('Success', rows2);
	}
	process.exit(0);
});

connection.end();