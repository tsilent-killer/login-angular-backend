const mysql = require('mysql');


const db = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "strong@1234",
	database: "login_page_test"
});

db.connect((err) => {
	if(err){
		console.log("Database not connected..." + err);
	} else {
		console.log("Database connected...");
	}
});


module.exports = db;