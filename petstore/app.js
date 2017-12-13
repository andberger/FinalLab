var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//handle form submit
app.post("/", function (req, res) {
	const pet = req.body.pet
	getPets(pet, function(data){
		let all = []
		console.log(data);
		if(data[0])data.forEach( e => {all.push([e.species, e.size, e.mood])});
		res.render('index', {
			animals: all
		});
	});
});

function getPets(searchString, callback){
	// open the database
	let db = new sqlite3.Database('./database/pet_store.db', sqlite3.OPEN_READWRITE, (err) => {
	  if (err) {
	    console.error(err.message);
	  }
	  console.log('Connected to the pet store database.');
	});
	let sql = "Select * from pets where species like '%" + searchString + "%';";
	let params = {};
	//let sql = "Select * from pets where species LIKE $speciesname";
	//let params = {$speciesname: '%'+searchString+'%'}
	db.serialize(() => {
	  db.all(sql,params, (err, rows) => {
	    if (err) {
	      console.error(err.message);
	    }
	    callback(rows)
	  });
	});
	 
	db.close((err) => {
	  if (err) {
	    console.error(err.message);
	  }
	  console.log('Close the database connection.');
	});
}

app.use('/', index);
app.use('/users', users);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
app.listen(3000, () => console.log('Example app listening on port 3000!'))

module.exports = app;
